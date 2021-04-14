"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.generateToken = exports.resetPassword = exports.resendToken = exports.verifyAccount = exports.validateForgotPassword = exports.forgotPassword = exports.logout = exports.refreshToken = exports.login = exports.authenticateJWT = void 0;
const constants_1 = require("../../util/constants");
const email_1 = __importDefault(require("../../services/email"));
const member_1 = __importDefault(require("../../models/member"));
const token_1 = __importDefault(require("../../models/token"));
const user_1 = __importDefault(require("../../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("config"));
const crypto_1 = __importDefault(require("crypto"));
const util_1 = require("../../util");
const user_2 = require("../user");
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
    const token = util_1.getToken(authHeader);
    if (!token) {
        return res.status(500).json({
            errorId: constants_1.TOKEN_MISSING,
            message: "Token is missing",
            code: constants_1.UNAUTHORIZED,
        });
    }
    const user = await user_1.default.findOne({ token: token });
    let secret;
    if (user === null || user === void 0 ? void 0 : user.token) {
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
        return next();
    });
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
        const user = await user_2.getUserByEmail(email);
        if (!user) {
            return res.status(422).json({
                message: "Email is not registered with us. Please create an account",
            });
        }
        if (!(user === null || user === void 0 ? void 0 : user.isVerified)) {
            return res.status(422).json({
                message: "Your account is not verified yet. Please check your inbox and confirm your email",
            });
        }
        // Check password
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid)
            return res
                .status(422)
                .json({ errorId: constants_1.INCORRECT_PASSWORD, message: "Incorrect Password" });
        const payload = {
            _id: user._id,
            name: user.name,
            description: user.description,
            email: user.email,
            accountType: user.accountType,
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
        await user_1.default.findByIdAndUpdate(user._id, {
            token: refreshToken,
        });
        await index_1.socket.emit(`login-success`);
        return res.status(200).json({
            success: true,
            token: token,
            refreshToken: refreshToken,
            accountType: user === null || user === void 0 ? void 0 : user.accountType,
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
        const user = await user_1.default.findOne({
            token: req.body.refreshToken,
        });
        if (!user) {
            return res.status(401).json({ error: "Token expired!" });
        }
        //extract payload from refresh token and generate a new access token and send it
        const payload = jsonwebtoken_1.default.verify(user === null || user === void 0 ? void 0 : user.token, config_1.default.get("refreshTokenSecret"));
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
        return res.status(401).send(err || err.message);
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
        await user_1.default.findByIdAndUpdate(req.body.userId, {
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
        const user = await user_1.default.findOne({
            email: req.body.email,
        });
        if (!user) {
            return res.status(409).json({
                errorId: constants_1.NOT_FOUND,
                message: "Email does not exist! Please create account",
            });
        }
        const token = new token_1.default({
            userId: user._id,
            token: crypto_1.default.randomBytes(16).toString("hex"),
            createdAt: Date.now(),
        });
        await token.save();
        await token_1.default.find({
            userId: user._id,
            token: { $ne: token === null || token === void 0 ? void 0 : token.token },
        })
            .remove()
            .exec();
        //@TODO - Send forgot password email to reset the password
        await emailService.sendEmail("/templates/forgot-password.ejs", {
            url: config_1.default.get("url"),
            confirm_link: `${config_1.default.get("url")}/reset-password/${token === null || token === void 0 ? void 0 : token.token}`,
            name: user.name,
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
        const user = await user_1.default.findOne({
            _id: token.userId,
        });
        if (user) {
            return res.status(200).json({
                user: { _id: user._id },
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
        const user = await user_1.default.findOne({
            _id: token.userId,
        });
        if (!user) {
            return res.status(500).send({
                errorId: constants_1.NOT_FOUND,
                message: "We are unable to find a user for this token.",
            });
        }
        if ((user === null || user === void 0 ? void 0 : user.isVerified) && user.email === user.newEmail) {
            return res.status(500).send({
                errorId: constants_1.ALREADY_VERIFIED,
                message: "This account has already been verified. Please login",
            });
        }
        const currentEmail = user.email;
        // Verify and save the user
        user.isVerified = true;
        user.isActive = true;
        user.email = user.newEmail; // Add new email address to current email address
        const userUpdated = await user.save();
        if (!userUpdated) {
            return res.status(500).send({
                errorId: constants_1.INTERNAL_SERVER_ERROR,
                message: "Error while verifying the account",
            });
        }
        const memberQuery = { email: currentEmail, userId: userUpdated === null || userUpdated === void 0 ? void 0 : userUpdated._id }, updateMember = {
            $set: {
                name: userUpdated.name,
                email: userUpdated.email,
                userId: userUpdated === null || userUpdated === void 0 ? void 0 : userUpdated._id,
                isVerified: userUpdated.isVerified,
                isAuthor: true,
            },
        }, memberOptions = { upsert: true, new: true, setDefaultsOnInsert: true };
        await member_1.default.findOneAndUpdate(memberQuery, updateMember, memberOptions);
        await emailService.sendEmail("/templates/welcome.ejs", {
            url: config_1.default.get("url"),
            login_link: `${config_1.default.get("url")}/login`,
            name: user.name,
        }, user.email, "Welcome to letsdoretro.com");
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
        const user = await user_1.default.findOne({
            email: req.body.email,
        });
        if (!user) {
            return res.status(500).json({
                errorId: constants_1.NOT_FOUND,
                message: "We are unable to find a user with that email.",
            });
        }
        if (user.isVerified)
            return res.status(500).json({
                errorId: constants_1.ALREADY_VERIFIED,
                message: "This account has already been verified. Please log in.",
            });
        const token = new token_1.default({
            userId: user._id,
            token: crypto_1.default.randomBytes(16).toString("hex"),
        });
        const newToken = await token.save();
        await emailService.sendEmail("/templates/account-confirmation.ejs", {
            url: config_1.default.get("url"),
            confirm_link: `${config_1.default.get("url")}/verify/${newToken === null || newToken === void 0 ? void 0 : newToken.token}`,
            name: user.name,
        }, req.body.email, "Please confirm your email");
        return res.status(200).json({
            message: "A verification email has been sent to " + user.email + ".",
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
        const user = await user_1.default.findOne({
            _id: mongoose_1.default.Types.ObjectId(req.body.userId),
        });
        const isPasswordSame = await bcrypt_1.default.compare(req.body.password.trim(), user.password.trim());
        if (isPasswordSame) {
            return res.status(500).json({
                message: "Your new password and old password can't be same. Please use different one",
            });
        }
        const hash = await bcrypt_1.default.hash(req.body.password, Number(config_1.default.get("bcryptSalt")));
        const query = {
            _id: mongoose_1.default.Types.ObjectId(req.body.userId),
        }, update = {
            $set: {
                password: hash,
            },
        }, options = { useFindAndModify: true };
        const updated = await user_1.default.findOneAndUpdate(query, update, options);
        if (!updated) {
            return res
                .status(500)
                .json({ message: "Error while updating new password" });
        }
        await emailService.sendEmail("/templates/password-changed.ejs", {
            url: config_1.default.get("url"),
            login_link: `${config_1.default.get("url")}/login`,
            name: updated.name,
        }, updated.email, "Your letsdoretro password has been changed");
        await token_1.default.find({
            userId: updated._id,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9hdXRoL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9EQVU4QjtBQUc5QixpRUFBZ0Q7QUFDaEQsaUVBQXlDO0FBQ3pDLCtEQUF1QztBQUN2Qyw2REFBcUM7QUFDckMsb0RBQTRCO0FBQzVCLG9EQUE0QjtBQUM1QixvREFBNEI7QUFDNUIscUNBQXNDO0FBQ3RDLGtDQUF5QztBQUN6QyxnRUFBK0I7QUFDL0Isd0RBQWdDO0FBQ2hDLHVDQUFxQztBQUVyQzs7Ozs7OztHQU9HO0FBQ0ksS0FBSyxVQUFVLGVBQWUsQ0FDbkMsR0FBWSxFQUNaLEdBQWEsRUFDYixJQUFrQjtJQUVsQixNQUFNLFVBQVUsR0FBVyxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQXVCLENBQUM7SUFDL0QsTUFBTSxLQUFLLEdBQUcsZUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ25DLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDVixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLE9BQU8sRUFBRSx5QkFBYTtZQUN0QixPQUFPLEVBQUUsa0JBQWtCO1lBQzNCLElBQUksRUFBRSx3QkFBWTtTQUNuQixDQUFDLENBQUM7S0FDSjtJQUNELE1BQU0sSUFBSSxHQUFRLE1BQU0sY0FBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELElBQUksTUFBVyxDQUFDO0lBQ2hCLElBQUksSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEtBQUssRUFBRTtRQUNmLE1BQU0sR0FBRyxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0tBQzNDO1NBQU07UUFDTCxNQUFNLEdBQUcsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztL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