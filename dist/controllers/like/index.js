"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLike = void 0;
const like_1 = __importDefault(require("../../models/like"));
const note_1 = require("../note");
async function createLike(req, res, next) {
    try {
        const like = new like_1.default(req.body);
        const likeCreated = await like.save();
        if (!likeCreated) {
            return res.status(500).send("Resource creation is failed");
        }
        const added = await note_1.addLikeToNote(likeCreated._id, req.body.noteId);
        if (!added) {
            return next(added);
        }
        return res.status(200).send("Resource created Successfully");
    }
    catch (err) {
        throw new Error(err || err.message);
    }
}
exports.createLike = createLike;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9saWtlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLDZEQUFxQztBQUNyQyxrQ0FBd0M7QUFFakMsS0FBSyxVQUFVLFVBQVUsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO0lBQzlFLElBQUk7UUFDRixNQUFNLElBQUksR0FBRyxJQUFJLGNBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdEMsSUFBRyxDQUFDLFdBQVcsRUFBQztZQUNkLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQztTQUM1RDtRQUNELE1BQU0sS0FBSyxHQUFHLE1BQU0sb0JBQWEsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEUsSUFBRyxDQUFDLEtBQUssRUFBQztZQUNSLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3BCO1FBQ0QsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0tBQzlEO0lBQUMsT0FBTSxHQUFHLEVBQUU7UUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDckM7QUFDSCxDQUFDO0FBZkQsZ0NBZUM7QUFBQSxDQUFDIn0=