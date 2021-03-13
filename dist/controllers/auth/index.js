"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.generateToken = exports.resetPassword = exports.resendToken = exports.verifyAccount = exports.validateForgotPasswordToken = exports.forgotPassword = exports.logout = exports.refreshToken = exports.login = exports.authenticateJWT = void 0;
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
                return res.status(401).json({ status: "error", code: "UNAUTHORIZED" });
            }
            if (!user) {
                return res.status(401).json({ status: "error", code: "UNAUTHORIZED" });
            }
            else {
                return next();
            }
        });
    }
    else {
        return res.status(401).json({ status: "error", code: "UNAUTHORIZED" });
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
                .json({ message: "Please enter valid email address" });
        }
        if (!(organization === null || organization === void 0 ? void 0 : organization.isVerified)) {
            return res.status(422).json({
                message: "Your account is not verified yet. Please check your inbox and confirm your email",
            });
        }
        // Check password
        const isPasswordValid = await bcrypt_1.default.compare(password, organization.password);
        if (!isPasswordValid)
            return res.status(422).json({ message: "Invalid Password" });
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
            return res.status(500).json({ message: "Email is required" });
        }
        const organization = await organization_1.default.findOne({ email: req.body.email });
        if (!organization) {
            return res.status(409).json({ message: "Email does not exist" });
        }
        const token = new token_1.default({
            organizationId: organization._id,
            token: crypto_1.default.randomBytes(16).toString("hex"),
            expires: Date.now() + 3600000,
        });
        await token.save();
        await token_1.default.find({
            organizationId: organization._id,
            token: { $ne: token.token },
        })
            .remove()
            .exec();
        //@TODO - Send forgot password email to reset the password
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
async function validateForgotPasswordToken(req, res) {
    try {
        if (!req.body.token) {
            return res.status(500).json({ message: "Token is required" });
        }
        const token = await token_1.default.findOne({
            token: req.body.token,
            expires: { $gt: Date.now() },
        });
        if (!token) {
            return res
                .status(409)
                .json({ message: "Password reset token is invalid or has expired" });
        }
        const updated = organization_1.default.findOne({
            _id: token.organizationId,
        });
        if (updated) {
            return res.status(200).json({ message: "Token verified successfully." });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err || err.message });
    }
}
exports.validateForgotPasswordToken = validateForgotPasswordToken;
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
                .json({ errorId: "NOT_FOUND", message: "Token is required" });
        }
        const emailService = await new email_1.default();
        const token = await token_1.default.findOne({
            token: req.body.token,
        });
        if (!token) {
            return res.status(500).json({
                errorId: "TOKEN_EXPIRED",
                message: "We are unable to find a valid token. Your token my have expired.",
            });
        }
        const organization = await organization_1.default.findOne({
            _id: token.organizationId,
        });
        if (!organization) {
            return res.status(500).send({
                errorId: "NOT_FOUND",
                message: "We are unable to find a user for this token.",
            });
        }
        if (organization === null || organization === void 0 ? void 0 : organization.isVerified) {
            return res.status(500).send({
                errorId: "ALREADY_VERIFIED",
                message: "This account has already been verified. Please login",
            });
        }
        // Verify and save the user
        organization.isVerified = true;
        organization.isActive = true;
        const saved = await organization.save();
        if (!saved) {
            return res.status(500).send({
                errorId: "INTERNAL_SERVER_ERROR",
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
            .json({ errorId: "INTERNAL_SERVER_ERROR", message: err || err.message });
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
                .json({ errorId: "NOT_FOUND", message: "Email address is required" });
        }
        const emailService = await new email_1.default();
        const organization = await organization_1.default.findOne({
            email: req.body.email,
        });
        if (!organization) {
            return res.status(500).json({
                errorId: "NOT_FOUND",
                message: "We are unable to find a user with that email.",
            });
        }
        if (organization.isVerified)
            return res.status(500).json({
                errorId: "ALREADY_VERIFIED",
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
            .json({ errorId: "INTERNAL_SERVER_ERROR", message: err || err.message });
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
        if (!req.body.token) {
            return res.status(500).json({ message: "Token is required" });
        }
        const token = await token_1.default.findOne({
            token: req.body.token,
            expires: { $gt: Date.now() },
        });
        if (!token) {
            return res
                .status(409)
                .json({ message: "Password reset token is invalid or has expired" });
        }
        const query = {
            _id: mongoose_1.default.Types.ObjectId(token.organizationId),
        }, update = {
            $set: {
                password: req.body.password,
            },
        };
        const updated = organization_1.default.findOneAndUpdate(query, update);
        if (!updated) {
            return res.status(200).json({ message: "Password can not reset" });
        }
        await token.remove();
        //@TODO - Send sucessfull password reset email
        return res.status(200).json({ message: "Password reset successfully" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9hdXRoL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLGlFQUFnRDtBQUNoRCw2RUFBcUQ7QUFDckQsK0RBQXVDO0FBQ3ZDLG9EQUE0QjtBQUM1QixvREFBNEI7QUFDNUIsb0RBQTRCO0FBQzVCLGtEQUF5RDtBQUN6RCxnRUFBK0I7QUFDL0Isd0RBQWdDO0FBQ2hDLHVDQUFxQztBQUVyQzs7Ozs7OztHQU9HO0FBQ0ksS0FBSyxVQUFVLGVBQWUsQ0FDbkMsR0FBWSxFQUNaLEdBQWEsRUFDYixJQUFrQjtJQUVsQixNQUFNLFVBQVUsR0FBVyxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQXVCLENBQUM7SUFDL0QsSUFBSSxVQUFVLEVBQUU7UUFDZCxNQUFNLEtBQUssR0FBVyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sWUFBWSxHQUFRLE1BQU0sc0JBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUN2RSxJQUFJLE1BQVcsQ0FBQztRQUNoQixJQUFJLFlBQVksYUFBWixZQUFZLHVCQUFaLFlBQVksQ0FBRSxLQUFLLEVBQUU7WUFDdkIsTUFBTSxHQUFHLGdCQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7U0FDM0M7YUFBTTtZQUNMLE1BQU0sR0FBRyxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQzFDO1FBQ0Qsc0JBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEdBQVEsRUFBRSxJQUFTLEVBQUUsRUFBRTtZQUNoRCxJQUFJLEdBQUcsRUFBRTtnQkFDUCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVB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