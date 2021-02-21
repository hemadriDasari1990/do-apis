"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.generateToken = exports.logout = exports.refreshToken = exports.login = exports.authenticateJWT = void 0;
const organization_1 = __importDefault(require("../../models/organization"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("config"));
const organization_2 = require("../organization");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../../index");
async function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
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
async function login(req, res) {
    try {
        const uniqueKey = req.body.uniqueKey;
        const password = req.body.password;
        const organization = await organization_2.getOrganizationByUniqueKey(uniqueKey);
        if (!(organization === null || organization === void 0 ? void 0 : organization._id)) {
            return res.status(422).json({ message: "Please enter valid unique key" });
        }
        // Check password
        const isPasswordValid = await bcrypt_1.default.compare(password, organization.password);
        if (!isPasswordValid)
            return res.status(422).json({ message: "Invalid Password" });
        const payload = {
            _id: organization._id,
            title: organization.title,
            description: organization.description
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
        await organization_1.default.findByIdAndUpdate(organization._id, { token: refreshToken });
        await index_1.socket.emit(`login-success`);
        return res.status(200).json({
            success: true,
            token: token,
            refreshToken: refreshToken
        });
    }
    catch (err) {
        return res.status(500).json({ message: err | err.message });
    }
}
exports.login = login;
;
async function refreshToken(req, res) {
    try {
        const organization = await organization_1.default.findOne({ token: req.body.refreshToken });
        if (!organization) {
            return res.status(401).json({ error: "Token expired!" });
        }
        //extract payload from refresh token and generate a new access token and send it
        const payload = jsonwebtoken_1.default.verify(organization === null || organization === void 0 ? void 0 : organization.token, config_1.default.get("refreshTokenSecret"));
        // Sign token
        const token = await refreshAccessToken(payload);
        if (!token) {
            return res.status(500).json({ message: "Error while generating the token" });
        }
        return res.status(200).json({
            success: true,
            token: token
        });
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.refreshToken = refreshToken;
;
async function logout(req, res) {
    try {
        await organization_1.default.findByIdAndUpdate(req.body.organizationId, { token: null });
        return res.status(200).json({ success: "User logged out!" });
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.logout = logout;
;
async function generateToken(payload) {
    try {
        const token = await jsonwebtoken_1.default.sign(payload, config_1.default.get("accessTokenSecret"), {
            expiresIn: "1hr" // 1 hr
        });
        return token;
    }
    catch (err) {
        throw err | err.message;
    }
}
exports.generateToken = generateToken;
async function refreshAccessToken(payload) {
    try {
        delete payload["exp"];
        const token = await jsonwebtoken_1.default.sign(payload, config_1.default.get("refreshTokenSecret"), {
            expiresIn: "1d" // 24 hrs
        });
        return token;
    }
    catch (err) {
        throw err | err.message;
    }
}
exports.refreshAccessToken = refreshAccessToken;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9hdXRoL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLDZFQUFxRDtBQUNyRCxvREFBNEI7QUFDNUIsb0RBQTRCO0FBQzVCLGtEQUE2RDtBQUM3RCxnRUFBK0I7QUFDL0IsdUNBQXFDO0FBRTlCLEtBQUssVUFBVSxlQUFlLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtJQUNqRixNQUFNLFVBQVUsR0FBVyxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQXVCLENBQUM7SUFDL0QsSUFBSSxVQUFVLEVBQUU7UUFDWixNQUFNLEtBQUssR0FBVyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sWUFBWSxHQUFRLE1BQU0sc0JBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUN2RSxJQUFJLE1BQVcsQ0FBQztRQUNoQixJQUFHLFlBQVksYUFBWixZQUFZLHVCQUFaLFlBQVksQ0FBRSxLQUFLLEVBQUM7WUFDckIsTUFBTSxHQUFHLGdCQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7U0FDM0M7YUFBTTtZQUNMLE1BQU0sR0FBRyxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQzFDO1FBQ0Qsc0JBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEdBQVEsRUFBRSxJQUFTLEVBQUUsRUFBRTtZQUM5QyxJQUFJLEdBQUcsRUFBRTtnQkFDTCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQzthQUMxRTtZQUNELElBQUks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