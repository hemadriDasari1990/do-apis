"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.generateToken = exports.resetPassword = exports.resendToken = exports.verifyAccount = exports.validateForgotPassword = exports.forgotPassword = exports.logout = exports.refreshToken = exports.login = exports.authenticateJWT = void 0;
const constants_1 = require("../../util/constants");
const email_1 = __importDefault(require("../../services/email"));
const token_1 = __importDefault(require("../../models/token"));
const user_1 = __importDefault(require("../../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("config"));
const member_1 = require("../member");
const crypto_1 = __importDefault(require("crypto"));
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
    if (authHeader) {
        const token = authHeader.split(" ")[1];
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
        const user = await user_2.getUserByEmail(email);
        if (!user) {
            return res
                .status(422)
                .json({ message: "Email is not registered with us" });
        }
        if (!(user === null || user === void 0 ? void 0 : user.isVerified)) {
            return res.status(422).json({
                message: "Your account is not verified yet. Please check your inbox and confirm your email",
            });
        }
        // Check password
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(422).json({ message: "Incorrect Password" });
        const payload = {
            _id: user._id,
            title: user.name,
            description: user.description,
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
        if (user === null || user === void 0 ? void 0 : user.isVerified) {
            return res.status(500).send({
                errorId: constants_1.ALREADY_VERIFIED,
                message: "This account has already been verified. Please login",
            });
        }
        // Verify and save the user
        user.isVerified = true;
        user.isActive = true;
        const userUpdated = await user.save();
        if (!userUpdated) {
            return res.status(500).send({
                errorId: constants_1.INTERNAL_SERVER_ERROR,
                message: "Error while verifying the account ",
            });
        }
        const member = {
            name: userUpdated.name,
            email: userUpdated.email,
            userId: userUpdated === null || userUpdated === void 0 ? void 0 : userUpdated._id,
            isVerified: userUpdated.isVerified,
            isAuthor: true,
        };
        await member_1.createMember(member);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9hdXRoL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9EQVE4QjtBQUc5QixpRUFBZ0Q7QUFDaEQsK0RBQXVDO0FBQ3ZDLDZEQUFxQztBQUNyQyxvREFBNEI7QUFDNUIsb0RBQTRCO0FBQzVCLHNDQUF5QztBQUN6QyxvREFBNEI7QUFDNUIsa0NBQXlDO0FBQ3pDLGdFQUErQjtBQUMvQix3REFBZ0M7QUFDaEMsdUNBQXFDO0FBRXJDOzs7Ozs7O0dBT0c7QUFDSSxLQUFLLFVBQVUsZUFBZSxDQUNuQyxHQUFZLEVBQ1osR0FBYSxFQUNiLElBQWtCO0lBRWxCLE1BQU0sVUFBVSxHQUFXLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBdUIsQ0FBQztJQUMvRCxJQUFJLFVBQVUsRUFBRTtRQUNkLE1BQU0sS0FBSyxHQUFXLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0MsTUFBTSxJQUFJLEdBQVEsTUFBTSxjQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDdkQsSUFBSSxNQUFXLENBQUM7UUFDaEIsSUFBSSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsS0FBSyxFQUFFO1lBQ2YsTUFBTSxHQUFHLGdCQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7U0FDM0M7YUFBTTtZQUNMLE1BQU0sR0FBRyxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQzFDO1FBQ0Qsc0JBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEdBQVEsRUFBRSxJQUFTLEVBQUUsRUFBRTtZQUNoRCxJQUFJLEdBQUcsRUFBRTtnQkFDUCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FB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