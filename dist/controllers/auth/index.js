"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.generateToken = exports.resetPassword = exports.resendToken = exports.verifyAccount = exports.validateForgotPassword = exports.forgotPassword = exports.logout = exports.refreshToken = exports.login = exports.authenticateJWT = void 0;
const constants_1 = require("../../util/constants");
const email_1 = __importDefault(require("../../services/email"));
const organization_1 = __importDefault(require("../../models/organization"));
const token_1 = __importDefault(require("../../models/token"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("config"));
const crypto_1 = __importDefault(require("crypto"));
const organization_2 = require("../organization");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../../index");
/**
 * Validate the token
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
async function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        const organization = await organization_1.default.findOne({ token: token });
        let secret;
        if (organization === null || organization === void 0 ? void 0 : organization.token) {
            secret = config_1.default.get("refreshTokenSecret");
        }
        else {
            secret = config_1.default.get("accessTokenSecret");
        }
        jsonwebtoken_1.default.verify(token, secret, (err, user) => {
            if (err) {
                return res.status(401).json({ status: "error", code: constants_1.UNAUTHORIZED });
            }
            if (!user) {
                return res.status(401).json({ status: "error", code: constants_1.UNAUTHORIZED });
            }
            else {
                return next();
            }
        });
    }
    else {
        return res.status(401).json({ status: "error", code: constants_1.UNAUTHORIZED });
    }
}
exports.authenticateJWT = authenticateJWT;
/**
 * Login user
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
async function login(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const organization = await organization_2.getOrganizationByEmail(email);
        if (!organization) {
            return res
                .status(422)
                .json({ message: "Email is not registered with us" });
        }
        if (!(organization === null || organization === void 0 ? void 0 : organization.isVerified)) {
            return res.status(422).json({
                message: "Your account is not verified yet. Please check your inbox and confirm your email",
            });
        }
        // Check password
        const isPasswordValid = await bcrypt_1.default.compare(password, organization.password);
        if (!isPasswordValid)
            return res.status(422).json({ message: "Incorrect Password" });
        const payload = {
            _id: organization._id,
            title: organization.title,
            description: organization.description,
        };
        // Sign token
        const token = await generateToken(payload);
        if (!token) {
            return res.status(500).json({ message: "Error while logging in" });
        }
        const refreshToken = await refreshAccessToken(payload);
        if (!refreshToken) {
            return res.status(500).json({ message: "Error while logging in" });
        }
        await organization_1.default.findByIdAndUpdate(organization._id, {
            token: refreshToken,
        });
        await index_1.socket.emit(`login-success`);
        return res.status(200).json({
            success: true,
            token: token,
            refreshToken: refreshToken,
        });
    }
    catch (err) {
        return res.status(500).json({ message: err | err.message });
    }
}
exports.login = login;
/**
 * Refresh token for user
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
async function refreshToken(req, res) {
    try {
        const organization = await organization_1.default.findOne({
            token: req.body.refreshToken,
        });
        if (!organization) {
            return res.status(401).json({ error: "Token expired!" });
        }
        //extract payload from refresh token and generate a new access token and send it
        const payload = jsonwebtoken_1.default.verify(organization === null || organization === void 0 ? void 0 : organization.token, config_1.default.get("refreshTokenSecret"));
        // Sign token
        const token = await refreshAccessToken(payload);
        if (!token) {
            return res
                .status(500)
                .json({ message: "Error while generating the token" });
        }
        return res.status(200).json({
            success: true,
            token: token,
        });
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.refreshToken = refreshToken;
/**
 * Innvalidate the session and logout user
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
async function logout(req, res) {
    try {
        await organization_1.default.findByIdAndUpdate(req.body.organizationId, {
            token: null,
        });
        return res.status(200).json({ success: "User logged out!" });
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.logout = logout;
/**
 * Generate forgot password token and send an email notification to reset
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
async function forgotPassword(req, res) {
    try {
        if (!req.body.email) {
            return res
                .status(500)
                .json({ errorId: constants_1.REQUIRED, message: "Email is required" });
        }
        const emailService = await new email_1.default();
        const organization = await organization_1.default.findOne({
            email: req.body.email,
        });
        if (!organization) {
            return res.status(409).json({
                errorId: constants_1.NOT_FOUND,
                message: "Email does not exist! Please create account",
            });
        }
        const token = new token_1.default({
            organizationId: organization._id,
            token: crypto_1.default.randomBytes(16).toString("hex"),
            createdAt: Date.now(),
        });
        await token.save();
        await token_1.default.find({
            organizationId: organization._id,
            token: { $ne: token === null || token === void 0 ? void 0 : token.token },
        })
            .remove()
            .exec();
        //@TODO - Send forgot password email to reset the password
        await emailService.sendEmail("/templates/forgot-password.ejs", {
            url: config_1.default.get("url"),
            confirm_link: `${config_1.default.get("url")}/reset-password/${token === null || token === void 0 ? void 0 : token.token}`,
            name: organization.title,
        }, req.body.email, "Resetting your letsdoretro password");
        res.status(200).json({
            message: "Email has been sent. Please check your inbox for further instructions to reset the password",
        });
    }
    catch (err) {
        return res.status(500).json({ message: err || err.message });
    }
}
exports.forgotPassword = forgotPassword;
/**
 * Validate the forgot password token request
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
async function validateForgotPassword(req, res) {
    try {
        if (!req.body.token) {
            return res
                .status(500)
                .json({ errorId: constants_1.REQUIRED, message: "Token is required" });
        }
        const token = await token_1.default.findOne({
            token: req.body.token,
        });
        if (!token) {
            return res.status(409).json({
                errorId: constants_1.TOKEN_EXPIRED,
                message: "Password reset token is invalid or has expired",
            });
        }
        const organization = await organization_1.default.findOne({
            _id: token.organizationId,
        });
        if (organization) {
            return res.status(200).json({
                organization: { _id: organization._id },
                message: "Token verified successfully. Please set new password",
            });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err || err.message });
    }
}
exports.validateForgotPassword = validateForgotPassword;
/**
 * Validate the forgot password token request
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
async function verifyAccount(req, res) {
    try {
        if (!req.body.token) {
            return res
                .status(500)
                .json({ errorId: constants_1.NOT_FOUND, message: "Token is required" });
        }
        const emailService = await new email_1.default();
        const token = await token_1.default.findOne({
            token: req.body.token,
        });
        if (!token) {
            return res.status(500).json({
                errorId: constants_1.TOKEN_EXPIRED,
                message: "We are unable to find a valid token. Your token my have expired.",
            });
        }
        const organization = await organization_1.default.findOne({
            _id: token.organizationId,
        });
        if (!organization) {
            return res.status(500).send({
                errorId: constants_1.NOT_FOUND,
                message: "We are unable to find a user for this token.",
            });
        }
        if (organization === null || organization === void 0 ? void 0 : organization.isVerified) {
            return res.status(500).send({
                errorId: constants_1.ALREADY_VERIFIED,
                message: "This account has already been verified. Please login",
            });
        }
        // Verify and save the user
        organization.isVerified = true;
        organization.isActive = true;
        const saved = await organization.save();
        if (!saved) {
            return res.status(500).send({
                errorId: constants_1.INTERNAL_SERVER_ERROR,
                message: "Error while verifying the account ",
            });
        }
        await emailService.sendEmail("/templates/welcome.ejs", {
            url: config_1.default.get("url"),
            login_link: `${config_1.default.get("url")}/login`,
            name: organization.title,
        }, organization.email, "Welcome to letsdoretro.com");
        return res
            .status(200)
            .json({ message: "The account has been verified. Please login!" });
    }
    catch (err) {
        return res
            .status(500)
            .json({ errorId: constants_1.INTERNAL_SERVER_ERROR, message: err || err.message });
    }
}
exports.verifyAccount = verifyAccount;
/**
 * Validate the forgot password token request
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
async function resendToken(req, res) {
    try {
        if (!req.body.email) {
            return res
                .status(500)
                .json({ errorId: constants_1.NOT_FOUND, message: "Email address is required" });
        }
        const emailService = await new email_1.default();
        const organization = await organization_1.default.findOne({
            email: req.body.email,
        });
        if (!organization) {
            return res.status(500).json({
                errorId: constants_1.NOT_FOUND,
                message: "We are unable to find a user with that email.",
            });
        }
        if (organization.isVerified)
            return res.status(500).json({
                errorId: constants_1.ALREADY_VERIFIED,
                message: "This account has already been verified. Please log in.",
            });
        const token = new token_1.default({
            organizationId: organization._id,
            token: crypto_1.default.randomBytes(16).toString("hex"),
        });
        const newToken = await token.save();
        await emailService.sendEmail("/templates/account-confirmation.ejs", {
            url: config_1.default.get("url"),
            confirm_link: `${config_1.default.get("url")}/verify/${newToken === null || newToken === void 0 ? void 0 : newToken.token}`,
            name: organization.title,
        }, req.body.email, "Please confirm your email");
        return res.status(200).json({
            message: "A verification email has been sent to " + organization.email + ".",
        });
    }
    catch (err) {
        return res
            .status(500)
            .json({ errorId: constants_1.INTERNAL_SERVER_ERROR, message: err || err.message });
    }
}
exports.resendToken = resendToken;
/**
 * Reset new Password
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
async function resetPassword(req, res) {
    try {
        if (!req.body.password) {
            return res.status(500).json({ message: "Password is required" });
        }
        if (!req.body.confirmPassword) {
            return res.status(500).json({ message: "Confirm Password is required" });
        }
        const emailService = await new email_1.default();
        const organization = await organization_1.default.findOne({
            _id: mongoose_1.default.Types.ObjectId(req.body.organizationId),
        });
        const isPasswordSame = await bcrypt_1.default.compare(req.body.password.trim(), organization.password.trim());
        if (isPasswordSame) {
            return res.status(500).json({
                message: "Your new password and old password can't be same. Please use different one",
            });
        }
        const hash = await bcrypt_1.default.hash(req.body.password, Number(config_1.default.get("bcryptSalt")));
        const query = {
            _id: mongoose_1.default.Types.ObjectId(req.body.organizationId),
        }, update = {
            $set: {
                password: hash,
            },
        }, options = { useFindAndModify: true };
        const updated = await organization_1.default.findOneAndUpdate(query, update, options);
        if (!updated) {
            return res
                .status(500)
                .json({ message: "Error while updating new password" });
        }
        await emailService.sendEmail("/templates/password-changed.ejs", {
            url: config_1.default.get("url"),
            login_link: `${config_1.default.get("url")}/login`,
            name: updated.title,
        }, updated.email, "Your letsdoretro password has been changed");
        await token_1.default.find({
            organizationId: updated._id,
        })
            .remove()
            .exec();
        return res.status(200).json({
            code: constants_1.VERIFIED,
            message: "Password reset successfully! Login now",
        });
    }
    catch (err) {
        return res.status(500).json({ message: err || err.message });
    }
}
exports.resetPassword = resetPassword;
/**
 * Generate New Token
 *
 * @param {Object} payload
 * @returns {String}
 */
async function generateToken(payload) {
    try {
        const token = await jsonwebtoken_1.default.sign(payload, config_1.default.get("accessTokenSecret"), {
            expiresIn: "1hr",
        });
        return token;
    }
    catch (err) {
        throw err | err.message;
    }
}
exports.generateToken = generateToken;
/**
 * Generate refresh token
 *
 * @param {Object} payload
 * @returns {String}
 */
async function refreshAccessToken(payload) {
    try {
        delete payload["exp"];
        const token = await jsonwebtoken_1.default.sign(payload, config_1.default.get("refreshTokenSecret"), {
            expiresIn: 86400,
        });
        return token;
    }
    catch (err) {
        throw err | err.message;
    }
}
exports.refreshAccessToken = refreshAccessToken;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9hdXRoL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9EQVE4QjtBQUc5QixpRUFBZ0Q7QUFDaEQsNkVBQXFEO0FBQ3JELCtEQUF1QztBQUN2QyxvREFBNEI7QUFDNUIsb0RBQTRCO0FBQzVCLG9EQUE0QjtBQUM1QixrREFBeUQ7QUFDekQsZ0VBQStCO0FBQy9CLHdEQUFnQztBQUNoQyx1Q0FBcUM7QUFFckM7Ozs7Ozs7R0FPRztBQUNJLEtBQUssVUFBVSxlQUFlLENBQ25DLEdBQVksRUFDWixHQUFhLEVBQ2IsSUFBa0I7SUFFbEIsTUFBTSxVQUFVLEdBQVcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUF1QixDQUFDO0lBQy9ELElBQUksVUFBVSxFQUFFO1FBQ2QsTUFBTSxLQUFLLEdBQVcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQyxNQUFNLFlBQVksR0FBUSxNQUFNLHNCQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDdkUsSUFBSSxNQUFXLENBQUM7UUFDaEIsSUFBSSxZQUFZLGFBQVosWUFBWSx1QkFBWixZQUFZLENBQUUsS0FBSyxFQUFFO1lBQ3ZCLE1BQU0sR0FBRyxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1NBQzNDO2FBQU07WUFDTCxNQUFNLEdBQUcsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztTQUMxQztRQUNELHNCQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFRLEVBQUUsSUFBUyxFQUFFLEVBQUU7WUFDaEQsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLHdCQUFZLEVBQUUsQ0FBQyxDQUFDO2FBQ3RFO1lBQ0QsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDVCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsd0JBQVksRUFBRSxDQUFDLENBQUM7YUFDdEU7aUJBQU07Z0JBQ0wsT0FBTyxJQUFJLEVBQUUsQ0FBQzthQUNmO1FBQ0gsQ0FBQyxDQUFDLENBQUM7S0FDSjtTQUFNO1FBQ0wsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLHdCQUFZLEVBQUUsQ0FBQyxDQUFDO0tBQ3RFO0FBQ0gsQ0FBQztBQTVCRCwwQ0E0QkM7QUFFRDs7Ozs7OztHQU9HO0FBQ0ksS0FBSyxVQUFVLEtBQUssQ0FBQyxHQUFZLEVBQUUsR0FBYTtJQUNyRCxJQUFJO1FBQ0YsTUFBTSxLQUFLLEdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDckMsTUFBTSxRQUFRLEdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDM0MsTUFBTSxZQUFZLEdBQTJCLE1BQU0scUNBQXNCLENBQ3ZFLEtBQUssQ0FDTixDQUFDO1FBQ0YsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixPQUFPLEdBQUc7aUJBQ1AsTUFBTSxDQUFDLEdBQUcsQ0FBQztpQkFDWCxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsaUNBQWlDLEVBQUUsQ0FBQyxDQUFDO1NBQ3pEO1FBQ0QsSUFBSSxFQUFDLFlBQVksYUFBWixZQUFZLHVCQUFaLFlBQVksQ0FBRSxVQUFVLENBQUEsRUFBRTtZQUM3QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixPQUFPLEVBQ0wsa0ZBQWtGO2FBQ3JGLENBQUMsQ0FBQztTQUNKO1FBQ0QsaUJBQWlCO1FBQ2pCLE1BQU0sZUFBZSxHQUFHLE1BQU0sZ0JBQU0sQ0FBQyxPQUFPLENBQzFDLFFBQVEsRUFDUixZQUFZLENBQUMsUUFBUSxDQUN0QixDQUFDO1FBQ0YsSUFBSSxDQUFDLGVBQWU7WUFDbEIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxDQUFDLENBQUM7UUFDakUsTUFBTSxPQUFPLEdBQUc7WUFDZCxHQUFHLEVBQUUsWUFBWSxDQUFDLEdBQUc7WUFDckIsS0FBSyxFQUFFLFlBQVksQ0FBQyxLQUFLO1lBQ3pCLFdBQVcsRUFBRSxZQUFZLENBQUMsV0FBVztTQUN0QyxDQUFDO1FBRUYsYUFBYTtRQUNiLE1BQU0sS0FBSyxHQUFHLE1BQU0sYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLENBQUMsQ0FBQztTQUNwRTtRQUNELE1BQU0sWUFBWSxHQUFHLE1BQU0sa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLENBQUMsQ0FBQztTQUNwRTtRQUNELE1BQU0sc0JBQVksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFO1lBQ3JELEtBQUssRUFBRSxZQUFZO1NBQ3BCLENBQUMsQ0FBQztRQUNILE1BQU0sY0FBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNuQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLE9BQU8sRUFBRSxJQUFJO1lBQ2IsS0FBSyxFQUFFLEtBQUs7WUFDWixZQUFZLEVBQUUsWUFBWTtTQUMzQixDQUFDLENBQUM7S0FDSjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7S0FDN0Q7QUFDSCxDQUFDO0FBcERELHNCQW9EQztBQUVEOzs7Ozs7O0dBT0c7QUFDSSxLQUFLLFVBQVUsWUFBWSxDQUFDLEdBQVksRUFBRSxHQUFhO0lBQzVELElBQUk7UUFDRixNQUFNLFlBQVksR0FBUSxNQUFNLHNCQUFZLENBQUMsT0FBTyxDQUFDO1lBQ25ELEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVk7U0FDN0IsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQztTQUMxRDtRQUNELGdGQUFnRjtRQUNoRixNQUFNLE9BQU8sR0FBUSxzQkFBRyxDQUFDLE1BQU0sQ0FDN0IsWUFBWSxhQUFaLFlBQVksdUJBQVosWUFBWSxDQUFFLEtBQUssRUFDbkIsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FDakMsQ0FBQztRQUNGLGFBQWE7UUFDYixNQUFNLEtBQUssR0FBRyxNQUFNLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixPQUFPLEdBQUc7aUJBQ1AsTUFBTSxDQUFDLEdBQUcsQ0FBQztpQkFDWCxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsa0NBQWtDLEVBQUUsQ0FBQyxDQUFDO1NBQzFEO1FBQ0QsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMxQixPQUFPLEVBQUUsSUFBSTtZQUNiLEtBQUssRUFBRSxLQUFLO1NBQ2IsQ0FBQyxDQUFDO0tBQ0o7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNqRDtBQUNILENBQUM7QUEzQkQsb0NBMkJDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNJLEtBQUssVUFBVSxNQUFNLENBQUMsR0FBWSxFQUFFLEdBQWE7SUFDdEQsSUFBSTtRQUNGLE1BQU0sc0JBQVksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUM1RCxLQUFLLEVBQUUsSUFBSTtTQUNaLENBQUMsQ0FBQztRQUNILE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO0tBQzlEO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDakQ7QUFDSCxDQUFDO0FBVEQsd0JBU0M7QUFFRDs7Ozs7OztHQU9HO0FBQ0ksS0FBSyxVQUFVLGNBQWMsQ0FDbEMsR0FBWSxFQUNaLEdBQWE7SUFFYixJQUFJO1FBQ0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ25CLE9BQU8sR0FBRztpQkFDUCxNQUFNLENBQUMsR0FBRyxDQUFDO2lCQUNYLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxvQkFBUSxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxDQUFDLENBQUM7U0FDOUQ7UUFDRCxNQUFNLFlBQVksR0FBRyxNQUFNLElBQUksZUFBWSxFQUFFLENBQUM7UUFDOUMsTUFBTSxZQUFZLEdBQVEsTUFBTSxzQkFBWSxDQUFDLE9BQU8sQ0FBQztZQUNuRCxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLO1NBQ3RCLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDakIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDMUIsT0FBTyxFQUFFLHFCQUFTO2dCQUNsQixPQUFPLEVBQUUsNkNBQTZDO2FBQ3ZELENBQUMsQ0FBQztTQUNKO1FBRUQsTUFBTSxLQUFLLEdBQVEsSUFBSSxlQUFLLENBQUM7WUFDM0IsY0FBYyxFQUFFLFlBQVksQ0FBQyxHQUFHO1lBQ2hDLEtBQUssRUFBRSxnQkFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQzdDLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO1NBQ3RCLENBQUMsQ0FBQztRQUNILE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25CLE1BQU0sZUFBSyxDQUFDLElBQUksQ0FBQztZQUNmLGNBQWMsRUFBRSxZQUFZLENBQUMsR0FBRztZQUNoQyxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssRUFBRTtTQUM3QixDQUFDO2FBQ0MsTUFBTSxFQUFFO2FBQ1IsSUFBSSxFQUFFLENBQUM7UUFDViwwREFBMEQ7UUFDMUQsTUFBTSxZQUFZLENBQUMsU0FBUyxDQUMxQixnQ0FBZ0MsRUFDaEM7WUFDRSxHQUFHLEVBQUUsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQ3RCLFlBQVksRUFBRSxHQUFHLGdCQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssRUFBRTtZQUNuRSxJQUFJLEVBQUUsWUFBWSxDQUFDLEtBQUs7U0FDekIsRUFDRCxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFDZCxxQ0FBcUMsQ0FDdEMsQ0FBQztRQUNGLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ25CLE9BQU8sRUFDTCw2RkFBNkY7U0FDaEcsQ0FBQyxDQUFDO0tBQ0o7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQzlEO0FBQ0gsQ0FBQztBQW5ERCx3Q0FtREM7QUFFRDs7Ozs7OztHQU9HO0FBQ0ksS0FBSyxVQUFVLHNCQUFzQixDQUMxQyxHQUFZLEVBQ1osR0FBYTtJQUViLElBQUk7UUFDRixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDbkIsT0FBTyxHQUFHO2lCQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUM7aUJBQ1gsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLG9CQUFRLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLENBQUMsQ0FBQztTQUM5RDtRQUNELE1BQU0sS0FBSyxHQUFRLE1BQU0sZUFBSyxDQUFDLE9BQU8sQ0FBQztZQUNyQyxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLO1NBQ3RCLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixPQUFPLEVBQUUseUJBQWE7Z0JBQ3RCLE9BQU8sRUFBRSxnREFBZ0Q7YUFDMUQsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxNQUFNLFlBQVksR0FBUSxNQUFNLHNCQUFZLENBQUMsT0FBTyxDQUFDO1lBQ25ELEdBQUcsRUFBRSxLQUFLLENBQUMsY0FBYztTQUMxQixDQUFDLENBQUM7UUFDSCxJQUFJLFlBQVksRUFBRTtZQUNoQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixZQUFZLEVBQUUsRUFBRSxHQUFHLEVBQUUsWUFBWSxDQUFDLEdBQUcsRUFBRTtnQkFDdkMsT0FBTyxFQUFFLHNEQUFzRDthQUNoRSxDQUFDLENBQUM7U0FDSjtLQUNGO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUM5RDtBQUNILENBQUM7QUEvQkQsd0RBK0JDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNJLEtBQUssVUFBVSxhQUFhLENBQUMsR0FBWSxFQUFFLEdBQWE7SUFDN0QsSUFBSTtRQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNuQixPQUFPLEdBQUc7aUJBQ1AsTUFBTSxDQUFDLEdBQUcsQ0FBQztpQkFDWCxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUscUJBQVMsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO1NBQy9EO1FBQ0QsTUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFJLGVBQVksRUFBRSxDQUFDO1FBQzlDLE1BQU0sS0FBSyxHQUFRLE1BQU0sZUFBSyxDQUFDLE9BQU8sQ0FBQztZQUNyQyxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLO1NBQ3RCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixPQUFPLEVBQUUseUJBQWE7Z0JBQ3RCLE9BQU8sRUFDTCxrRUFBa0U7YUFDckUsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxNQUFNLFlBQVksR0FBUSxNQUFNLHNCQUFZLENBQUMsT0FBTyxDQUFDO1lBQ25ELEdBQUcsRUFBRSxLQUFLLENBQUMsY0FBYztTQUMxQixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ2pCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzFCLE9BQU8sRUFBRSxxQkFBUztnQkFDbEIsT0FBTyxFQUFFLDhDQUE4QzthQUN4RCxDQUFDLENBQUM7U0FDSjtRQUNELElBQUksWUFBWSxhQUFaLFlBQVksdUJBQVosWUFBWSxDQUFFLFVBQVUsRUFBRTtZQUM1QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixPQUFPLEVBQUUsNEJBQWdCO2dCQUN6QixPQUFPLEVBQUUsc0RBQXNEO2FBQ2hFLENBQUMsQ0FBQztTQUNKO1FBQ0QsMkJBQTJCO1FBQzNCLFlBQVksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQy9CLFlBQVksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQzdCLE1BQU0sS0FBSyxHQUFHLE1BQU0sWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixPQUFPLEVBQUUsaUNBQXFCO2dCQUM5QixPQUFPLEVBQUUsb0NBQW9DO2FBQzlDLENBQUMsQ0FBQztTQUNKO1FBQ0QsTUFBTSxZQUFZLENBQUMsU0FBUyxDQUMxQix3QkFBd0IsRUFDeEI7WUFDRSxHQUFHLEVBQUUsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQ3RCLFVBQVUsRUFBRSxHQUFHLGdCQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRO1lBQ3hDLElBQUksRUFBRSxZQUFZLENBQUMsS0FBSztTQUN6QixFQUNELFlBQVksQ0FBQyxLQUFLLEVBQ2xCLDRCQUE0QixDQUM3QixDQUFDO1FBQ0YsT0FBTyxHQUFHO2FBQ1AsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSw4Q0FBOEMsRUFBRSxDQUFDLENBQUM7S0FDdEU7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU8sR0FBRzthQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDWCxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsaUNBQXFCLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUMxRTtBQUNILENBQUM7QUE5REQsc0NBOERDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNJLEtBQUssVUFBVSxXQUFXLENBQUMsR0FBWSxFQUFFLEdBQWE7SUFDM0QsSUFBSTtRQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNuQixPQUFPLEdBQUc7aUJBQ1AsTUFBTSxDQUFDLEdBQUcsQ0FBQztpQkFDWCxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUscUJBQVMsRUFBRSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZFO1FBQ0QsTUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFJLGVBQVksRUFBRSxDQUFDO1FBQzlDLE1BQU0sWUFBWSxHQUFRLE1BQU0sc0JBQVksQ0FBQyxPQUFPLENBQUM7WUFDbkQsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSztTQUN0QixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ2pCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzFCLE9BQU8sRUFBRSxxQkFBUztnQkFDbEIsT0FBTyxFQUFFLCtDQUErQzthQUN6RCxDQUFDLENBQUM7U0FDSjtRQUNELElBQUksWUFBWSxDQUFDLFVBQVU7WUFDekIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDMUIsT0FBTyxFQUFFLDRCQUFnQjtnQkFDekIsT0FBTyxFQUFFLHdEQUF3RDthQUNsRSxDQUFDLENBQUM7UUFDTCxNQUFNLEtBQUssR0FBRyxJQUFJLGVBQUssQ0FBQztZQUN0QixjQUFjLEVBQUUsWUFBWSxDQUFDLEdBQUc7WUFDaEMsS0FBSyxFQUFFLGdCQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7U0FDOUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxRQUFRLEdBQVEsTUFBTSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDekMsTUFBTSxZQUFZLENBQUMsU0FBUyxDQUMxQixxQ0FBcUMsRUFDckM7WUFDRSxHQUFHLEVBQUUsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQ3RCLFlBQVksRUFBRSxHQUFHLGdCQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxLQUFLLEVBQUU7WUFDOUQsSUFBSSxFQUFFLFlBQVksQ0FBQyxLQUFLO1NBQ3pCLEVBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQ2QsMkJBQTJCLENBQzVCLENBQUM7UUFDRixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLE9BQU8sRUFDTCx3Q0FBd0MsR0FBRyxZQUFZLENBQUMsS0FBSyxHQUFHLEdBQUc7U0FDdEUsQ0FBQyxDQUFDO0tBQ0o7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU8sR0FBRzthQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDWCxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsaUNBQXFCLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUMxRTtBQUNILENBQUM7QUE5Q0Qsa0NBOENDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNJLEtBQUssVUFBVSxhQUFhLENBQUMsR0FBWSxFQUFFLEdBQWE7SUFDN0QsSUFBSTtRQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUN0QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLENBQUMsQ0FBQztTQUNsRTtRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUM3QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLDhCQUE4QixFQUFFLENBQUMsQ0FBQztTQUMxRTtRQUNELE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBSSxlQUFZLEVBQUUsQ0FBQztRQUM5QyxNQUFNLFlBQVksR0FBUSxNQUFNLHNCQUFZLENBQUMsT0FBTyxDQUFDO1lBQ25ELEdBQUcsRUFBRSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7U0FDdEQsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxjQUFjLEdBQUcsTUFBTSxnQkFBTSxDQUFDLE9BQU8sQ0FDekMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQ3hCLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQzdCLENBQUM7UUFDRixJQUFJLGNBQWMsRUFBRTtZQUNsQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixPQUFPLEVBQ0wsNEVBQTRFO2FBQy9FLENBQUMsQ0FBQztTQUNKO1FBQ0QsTUFBTSxJQUFJLEdBQUcsTUFBTSxnQkFBTSxDQUFDLElBQUksQ0FDNUIsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQ2pCLE1BQU0sQ0FBQyxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUNqQyxDQUFDO1FBQ0YsTUFBTSxLQUFLLEdBQUc7WUFDVixHQUFHLEVBQUUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO1NBQ3RELEVBQ0QsTUFBTSxHQUFHO1lBQ1AsSUFBSSxFQUFFO2dCQUNKLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7U0FDRixFQUNELE9BQU8sR0FBRyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sT0FBTyxHQUFRLE1BQU0sc0JBQVksQ0FBQyxnQkFBZ0IsQ0FDdEQsS0FBSyxFQUNMLE1BQU0sRUFDTixPQUFPLENBQ1IsQ0FBQztRQUNGLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLEdBQUc7aUJBQ1AsTUFBTSxDQUFDLEdBQUcsQ0FBQztpQkFDWCxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsbUNBQW1DLEVBQUUsQ0FBQyxDQUFDO1NBQzNEO1FBQ0QsTUFBTSxZQUFZLENBQUMsU0FBUyxDQUMxQixpQ0FBaUMsRUFDakM7WUFDRSxHQUFHLEVBQUUsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQ3RCLFVBQVUsRUFBRSxHQUFHLGdCQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRO1lBQ3hDLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSztTQUNwQixFQUNELE9BQU8sQ0FBQyxLQUFLLEVBQ2IsNENBQTRDLENBQzdDLENBQUM7UUFDRixNQUFNLGVBQUssQ0FBQyxJQUFJLENBQUM7WUFDZixjQUFjLEVBQUUsT0FBTyxDQUFDLEdBQUc7U0FDNUIsQ0FBQzthQUNDLE1BQU0sRUFBRTthQUNSLElBQUksRUFBRSxDQUFDO1FBQ1YsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMxQixJQUFJLEVBQUUsb0JBQVE7WUFDZCxPQUFPLEVBQUUsd0NBQXdDO1NBQ2xELENBQUMsQ0FBQztLQUNKO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUM5RDtBQUNILENBQUM7QUFuRUQsc0NBbUVDO0FBRUQ7Ozs7O0dBS0c7QUFDSSxLQUFLLFVBQVUsYUFBYSxDQUFDLE9BRW5DO0lBQ0MsSUFBSTtRQUNGLE1BQU0sS0FBSyxHQUFXLE1BQU0sc0JBQUcsQ0FBQyxJQUFJLENBQ2xDLE9BQU8sRUFDUCxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxFQUMvQjtZQUNFLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQ0YsQ0FBQztRQUNGLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7S0FDekI7QUFDSCxDQUFDO0FBZkQsc0NBZUM7QUFFRDs7Ozs7R0FLRztBQUNJLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxPQUV4QztJQUNDLElBQUk7UUFDRixPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QixNQUFNLEtBQUssR0FBVyxNQUFNLHNCQUFHLENBQUMsSUFBSSxDQUNsQyxPQUFPLEVBQ1AsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsRUFDaEM7WUFDRSxTQUFTLEVBQUUsS0FBSztTQUNqQixDQUNGLENBQUM7UUFDRixPQUFPLEtBQUssQ0FBQztLQUNkO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO0tBQ3pCO0FBQ0gsQ0FBQztBQWhCRCxnREFnQkMifQ==