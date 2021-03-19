"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addDepartmentToUser = exports.getUserByEmail = exports.deleteUser = exports.getAllSummary = exports.getUsers = exports.getUserSummary = exports.getUserDetails = exports.resendActivationLink = exports.confirmEmail = exports.createUser = void 0;
const departmentFilters_1 = require("../../util/departmentFilters");
const board_1 = __importDefault(require("../../models/board"));
const email_1 = __importDefault(require("../../services/email"));
const user_1 = __importDefault(require("../../models/user"));
const project_1 = __importDefault(require("../../models/project"));
const token_1 = __importDefault(require("../../models/token"));
const constants_1 = require("../../util/constants");
const config_1 = __importDefault(require("config"));
const crypto_1 = __importDefault(require("crypto"));
// import bcrypt from "bcrypt";
const mongoose_1 = __importDefault(require("mongoose"));
async function createUser(req, res) {
    try {
        const emailService = await new email_1.default();
        const user = await getUserByEmail(req.body.email);
        if (user && !(user === null || user === void 0 ? void 0 : user.isVerified)) {
            return res.status(400).json({
                errorId: "USER_ALREADY_EXIST",
                message: `An account with following email ${req.body.email} already exist but not verified yet. Please check your inbox`,
            });
        }
        if (user && (user === null || user === void 0 ? void 0 : user.isVerified)) {
            return res.status(400).json({
                errorId: "EMAIL_VERIFIED",
                message: `An account with following email ${req.body.email} already exist and verified. Please login!`,
            });
        }
        // const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // if(!hashedPassword){
        //   return res
        //       .status(400)
        //       .json({ message: 'Error hashing password' });
        // }
        const newUser = new user_1.default({
            title: req.body.title,
            description: req.body.description,
            email: req.body.email,
            password: req.body.password,
            isAgreed: req.body.isAgreed,
        });
        const newOrg = await newUser.save();
        newOrg.password = undefined;
        const token = new token_1.default({
            userId: newUser._id,
            token: crypto_1.default.randomBytes(16).toString("hex"),
        });
        const newToken = await token.save();
        //@TODO - Send Email Activation Link
        await emailService.sendEmail("/templates/account-confirmation.ejs", {
            url: config_1.default.get("url"),
            confirm_link: `${config_1.default.get("url")}/verify/${newToken === null || newToken === void 0 ? void 0 : newToken.token}`,
            name: req.body.title,
        }, req.body.email, "Please confirm your email");
        return res.status(200).json({
            message: "An email verification link has been sent. Please check your inbox",
            newOrg,
        });
    } catch (err) {
        return res.status(500).json(err || err.message);
    }
}
exports.createUser = createUser;
async function confirmEmail(req, res) {
    try {
        const token = await token_1.default.findOne({
            token: req.params.token
        });
        if (!token) {
            return res.status(400).send({
                message: "Your verification link may have expired. Please click on resend for verify your Email.",
            });
        }
        const user = await user_1.default.findOne({
            _id: mongoose_1.default.Types.ObjectId(token.userId),
            email: req.params.email,
        });
        if (!user) {
            return res.status(401).send({
                message: `We are unable to find a user account associated with ${req.params.email} for this verification. Please SignUp!`,
            });
        }
        if (user.isVerified) {
            return res
                .status(200)
                .send("User has been already verified. Please Login");
        }
        user.isVerified = true;
        await user.save();
        //@TODO - Send successfully verified Email
        return res
            .status(200)
            .send("Your account has been successfully verified. Please login now");
    } catch (err) {
        return res.status(500).json(err || err.message);
    }
}
exports.confirmEmail = confirmEmail;
async function resendActivationLink(req, res) {
    try {
        const user = await user_1.default.findOne({
            email: req.params.email,
        });
        if (!user) {
            return res.status(401).send({
                message: `We are unable to find an user account associated with ${req.body.email}. Make sure your Email is correct!`,
            });
        }
        if (user.isVerified) {
            return res
                .status(200)
                .send("User has been already verified. Please Login");
        }
        const token = new token_1.default({
            userId: user._id,
            token: crypto_1.default.randomBytes(16).toString("hex"),
        });
        await token.save();
        //@TODO - Send Email Activation Link
    } catch (err) {
        return res.status(500).json(err || err.message);
    }
}
exports.resendActivationLink = resendActivationLink;
async function getUserDetails(req, res) {
    try {
        const query = {
            _id: mongoose_1.default.Types.ObjectId(req.params.id)
        };
        const users = await user_1.default.aggregate([{
                $match: query
            },
            departmentFilters_1.departmentsLookup,
            departmentFilters_1.departmentAddFields,
        ]);
        const org = users ? users[0] : null;
        if (org) {
            org.password = undefined;
            org.token = undefined;
            return res.status(200).json(org);
        }
        return res.status(401).json({
            code: constants_1.UNAUTHORIZED
        });
    } catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getUserDetails = getUserDetails;
async function getUserSummary(req, res) {
    try {
        const query = {
            _id: mongoose_1.default.Types.ObjectId(req.params.id)
        };
        const userSummary = await user_1.default.aggregate([{
                $match: query
            },
            departmentFilters_1.activeDepartmentsLookup,
            departmentFilters_1.departmentsLookup,
            departmentFilters_1.inActiveDepartmentsLookup,
            departmentFilters_1.departmentAddFields,
        ]);
        const org = userSummary ? userSummary[0] : null;
        if (org) {
            org.password = undefined;
            org.token = undefined;
        }
        return res.status(200).json(org);
    } catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getUserSummary = getUserSummary;
async function getUsers(req, res) {
    try {
        console.log(req);
        const users = await user_1.default.find({}).select({
            title: 1,
            isVerified: 1,
            description: 1,
            _id: 0,
        });
        return res.status(200).json({
            users,
        });
    } catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getUsers = getUsers;
async function getAllSummary(req, res) {
    try {
        console.log(req);
        const usersCount = await user_1.default.find({}).count();
        const projectsCount = await project_1.default.find({}).count();
        const boardsCount = await board_1.default.find({}).count();
        return res.status(200).json({
            usersCount,
            projectsCount,
            boardsCount,
        });
    } catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getAllSummary = getAllSummary;
async function deleteUser(req, res, next) {
    try {
        const deleted = await user_1.default.findByIdAndRemove(req.params.id);
        if (!deleted) {
            res.status(500).json({
                message: `Cannot delete resource`
            });
            return next(deleted);
        }
        return res
            .status(200)
            .json({
                message: "Resource has been deleted successfully"
            });
    } catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.deleteUser = deleteUser;
async function getUserByEmail(email) {
    try {
        const user = await user_1.default.findOne({
            email: email
        });
        return user;
    } catch (err) {
        return err || err.message;
    }
}
exports.getUserByEmail = getUserByEmail;
async function addDepartmentToUser(departmentId, userId) {
    try {
        if (!userId || !departmentId) {
            return;
        }
        const user = await user_1.default.findByIdAndUpdate(userId, {
            $push: {
                departments: departmentId
            }
        }, {
            new: true,
            useFindAndModify: false
        });
        return user;
    } catch (err) {
        throw "Cannot add department to user";
    }
}
exports.addDepartmentToUser = addDepartmentToUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9vcmdhbml6YXRpb24vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esb0VBS3NDO0FBRXRDLCtEQUF1QztBQUN2QyxpRUFBZ0Q7QUFDaEQsNkVBQXFEO0FBQ3JELG1FQUEyQztBQUMzQywrREFBdUM7QUFDdkMsb0RBQW9EO0FBQ3BELG9EQUE0QjtBQUM1QixvREFBNEI7QUFDNUIsK0JBQStCO0FBQy9CLHdEQUFnQztBQUV6QixLQUFLLFVBQVUsa0JBQWtCLENBQ3RDLEdBQVksRUFDWixHQUFhO0lBRWIsSUFBSTtRQUNGLE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBSSxlQUFZLEVBQUUsQ0FBQztRQUM5QyxNQUFNLFlBQVksR0FBRyxNQUFNLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEUsSUFBSSxZQUFZLElBQUksRUFBQyxZQUFZLGFBQVosWUFBWSx1QkFBWixZQUFZLENBQUUsVUFBVSxDQUFBLEVBQUU7WUFDN0MsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDMUIsT0FBTyxFQUFFLDRCQUE0QjtnQkFDckMsT0FBTyxFQUFFLG1DQUFtQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssOERBQThEO2FBQ3pILENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxZQUFZLEtBQUksWUFBWSxhQUFaLFlBQVksdUJBQVosWUFBWSxDQUFFLFVBQVUsQ0FBQSxFQUFFO1lBQzVDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzFCLE9BQU8sRUFBRSxnQkFBZ0I7Z0JBQ3pCLE9BQU8sRUFBRSxtQ0FBbUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLDRDQUE0QzthQUN2RyxDQUFDLENBQUM7U0FDSjtRQUVELG1FQUFtRTtRQUNuRSx1QkFBdUI7UUFDdkIsZUFBZTtRQUNmLHFCQUFxQjtRQUNyQixzREFBc0Q7UUFDdEQsSUFBSTtRQUVKLE1BQU0sZUFBZSxHQUEyQixJQUFJLHNCQUFZLENBQUM7WUFDL0QsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSztZQUNyQixXQUFXLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXO1lBQ2pDLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUs7WUFDckIsUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUTtZQUMzQixRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRO1NBQzVCLENBQUMsQ0FBQztRQUNILE1BQU0sTUFBTSxHQUFHLE1BQU0sZUFBZSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1FBRTVCLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBSyxDQUFDO1lBQ3RCLGNBQWMsRUFBRSxlQUFlLENBQUMsR0FBRztZQUNuQyxLQUFLLEVBQUUsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztTQUM5QyxDQUFDLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBUSxNQUFNLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6QyxvQ0FBb0M7UUFDcEMsTUFBTSxZQUFZLENBQUMsU0FBUyxDQUMxQixxQ0FBcUMsRUFDckM7WUFDRSxHQUFHLEVBQUUsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQ3RCLFlBQVksRUFBRSxHQUFHLGdCQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxLQUFLLEVBQUU7WUFDOUQsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSztTQUNyQixFQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUNkLDJCQUEyQixDQUM1QixDQUFDO1FBQ0YsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMxQixPQUFPLEVBQ0wsbUVBQW1FO1lBQ3JFLE1BQU07U0FDUCxDQUFDLENBQUM7S0FDSjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2pEO0FBQ0gsQ0FBQztBQTlERCxnREE4REM7QUFFTSxLQUFLLFVBQVUsWUFBWSxDQUFDLEdBQVksRUFBRSxHQUFhO0lBQzVELElBQUk7UUFDRixNQUFNLEtBQUssR0FBUSxNQUFNLGVBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixPQUFPLEVBQ0wsd0ZBQXdGO2FBQzNGLENBQUMsQ0FBQztTQUNKO1FBQ0QsTUFBTSxZQUFZLEdBQVEsTUFBTSxzQkFBWSxDQUFDLE9BQU8sQ0FBQztZQUNuRCxHQUFHLEVBQUUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUM7WUFDbEQsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSztTQUN4QixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ2pCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzFCLE9BQU8sRUFBRSxnRUFBZ0UsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLHdDQUF3QzthQUNsSSxDQUFDLENBQUM7U0FDSjtRQUNELElBQUksWUFBWSxDQUFDLFVBQVUsRUFBRTtZQUMzQixPQUFPLEdBQUc7aUJBQ1AsTUFBTSxDQUFDLEdBQUcsQ0FBQztpQkFDWCxJQUFJLENBQUMsc0RBQXNELENBQUMsQ0FBQztTQUNqRTtRQUNELFlBQVksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQy9CLE1BQU0sWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzFCLDBDQUEwQztRQUMxQyxPQUFPLEdBQUc7YUFDUCxNQUFNLENBQUMsR0FBRyxDQUFDO2FBQ1gsSUFBSSxDQUFDLCtEQUErRCxDQUFDLENBQUM7S0FDMUU7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNqRDtBQUNILENBQUM7QUFoQ0Qsb0NBZ0NDO0FBQ00sS0FBSyxVQUFVLG9CQUFvQixDQUN4QyxHQUFZLEVBQ1osR0FBYTtJQUViLElBQUk7UUFDRixNQUFNLFlBQVksR0FBUSxNQUFNLHNCQUFZLENBQUMsT0FBTyxDQUFDO1lBQ25ELEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7U0FDeEIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixPQUFPLEVBQUUsaUVBQWlFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxvQ0FBb0M7YUFDN0gsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLFlBQVksQ0FBQyxVQUFVLEVBQUU7WUFDM0IsT0FBTyxHQUFHO2lCQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUM7aUJBQ1gsSUFBSSxDQUFDLHNEQUFzRCxDQUFDLENBQUM7U0FDakU7UUFDRCxNQUFNLEtBQUssR0FBRyxJQUFJLGVBQUssQ0FBQztZQUN0QixjQUFjLEVBQUUsWUFBWSxDQUFDLEdBQUc7WUFDaEMsS0FBSyxFQUFFLGdCQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7U0FDOUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkIsb0NBQW9DO0tBQ3JDO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDakQ7QUFDSCxDQUFDO0FBM0JELG9EQTJCQztBQUVNLEtBQUssVUFBVSxzQkFBc0IsQ0FDMUMsR0FBWSxFQUNaLEdBQWE7SUFFYixJQUFJO1FBQ0YsTUFBTSxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUM5RCxNQUFNLGFBQWEsR0FBRyxNQUFNLHNCQUFZLENBQUMsU0FBUyxDQUFDO1lBQ2pELEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtZQUNqQixxQ0FBaUI7WUFDakIsdUNBQW1CO1NBQ3BCLENBQUMsQ0FBQztRQUNILE1BQU0sR0FBRyxHQUFRLGFBQWEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDekQsSUFBSSxHQUFHLEVBQUU7WUFDUCxHQUFHLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztZQUN6QixHQUFHLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztZQUN0QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xDO1FBQ0QsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSx3QkFBWSxFQUFFLENBQUMsQ0FBQztLQUNyRDtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2pEO0FBQ0gsQ0FBQztBQXJCRCx3REFxQkM7QUFFTSxLQUFLLFVBQVUsc0JBQXNCLENBQzFDLEdBQVksRUFDWixHQUFhO0lBRWIsSUFBSTtRQUNGLE1BQU0sS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLGtCQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDOUQsTUFBTSxtQkFBbUIsR0FBRyxNQUFNLHNCQUFZLENBQUMsU0FBUyxDQUFDO1lBQ3ZELEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtZQUNqQiwyQ0FBdUI7WUFDdkIscUNBQWlCO1lBQ2pCLDZDQUF5QjtZQUN6Qix1Q0FBbUI7U0FDcEIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxHQUFHLEdBQVEsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDckUsSUFBSSxHQUFHLEVBQUU7WUFDUCxHQUFHLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztZQUN6QixHQUFHLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztTQUN2QjtRQUNELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDbEM7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNqRDtBQUNILENBQUM7QUF0QkQsd0RBc0JDO0FBRU0sS0FBSyxVQUFVLGdCQUFnQixDQUNwQyxHQUFZLEVBQ1osR0FBYTtJQUViLElBQUk7UUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sYUFBYSxHQUFHLE1BQU0sc0JBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQ3ZELEtBQUssRUFBRSxDQUFDO1lBQ1IsVUFBVSxFQUFFLENBQUM7WUFDYixXQUFXLEVBQUUsQ0FBQztZQUNkLEdBQUcsRUFBRSxDQUFDO1NBQ1AsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMxQixhQUFhO1NBQ2QsQ0FBQyxDQUFDO0tBQ0o7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNqRDtBQUNILENBQUM7QUFsQkQsNENBa0JDO0FBRU0sS0FBSyxVQUFVLGFBQWEsQ0FBQyxHQUFZLEVBQUUsR0FBYTtJQUM3RCxJQUFJO1FBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixNQUFNLGtCQUFrQixHQUFHLE1BQU0sc0JBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDL0QsTUFBTSxhQUFhLEdBQUcsTUFBTSxpQkFBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyRCxNQUFNLFdBQVcsR0FBRyxNQUFNLGVBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDakQsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMxQixrQkFBa0I7WUFDbEIsYUFBYTtZQUNiLFdBQVc7U0FDWixDQUFDLENBQUM7S0FDSjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2pEO0FBQ0gsQ0FBQztBQWRELHNDQWNDO0FBRU0sS0FBSyxVQUFVLGtCQUFrQixDQUN0QyxHQUFZLEVBQ1osR0FBYSxFQUNiLElBQWtCO0lBRWxCLElBQUk7UUFDRixNQUFNLE9BQU8sR0FBRyxNQUFNLHNCQUFZLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDO1lBQzVELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3RCO1FBQ0QsT0FBTyxHQUFHO2FBQ1AsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSx3Q0FBd0MsRUFBRSxDQUFDLENBQUM7S0FDaEU7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNqRDtBQUNILENBQUM7QUFqQkQsZ0RBaUJDO0FBRU0sS0FBSyxVQUFVLHNCQUFzQixDQUFDLEtBQWE7SUFDeEQsSUFBSTtRQUNGLE1BQU0sWUFBWSxHQUFHLE1BQU0sc0JBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNsRSxPQUFPLFlBQVksQ0FBQztLQUNyQjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQztLQUMzQjtBQUNILENBQUM7QUFQRCx3REFPQztBQUVNLEtBQUssVUFBVSwyQkFBMkIsQ0FDL0MsWUFBb0IsRUFDcEIsY0FBc0I7SUFFdEIsSUFBSTtRQUNGLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDcEMsT0FBTztTQUNSO1FBQ0QsTUFBTSxZQUFZLEdBQUcsTUFBTSxzQkFBWSxDQUFDLGlCQUFpQixDQUN2RCxjQUFjLEVBQ2QsRUFBRSxLQUFLLEVBQUUsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFDeEMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxDQUN2QyxDQUFDO1FBQ0YsT0FBTyxZQUFZLENBQUM7S0FDckI7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE1BQU0sdUNBQXVDLENBQUM7S0FDL0M7QUFDSCxDQUFDO0FBakJELGtFQWlCQyJ9