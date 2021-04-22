"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionItemsLookup = exports.assignedToLookUp = exports.assignedByLookUp = exports.actionActionItemAddFields = exports.actionItemAddFields = void 0;
const member_1 = __importDefault(require("../models/member"));
const actionItem_1 = __importDefault(require("../models/actionItem"));
const action_1 = __importDefault(require("../models/action"));
const actionItemAddFields = {
    $addFields: {
        actionItems: "$actionItems",
        totalActionItems: { $size: { $ifNull: ["$actionItems", []] } },
        action: { $ifNull: ["$action", [null]] },
        assignedBy: { $ifNull: ["$assignedBy", [null]] },
        assignedTo: { $ifNull: ["$assignedTo", [null]] },
    },
};
exports.actionItemAddFields = actionItemAddFields;
const actionActionItemAddFields = {
    $addFields: {
        totalAction: { $size: { $ifNull: ["$actionItems", []] } },
        actionItems: [],
    },
};
exports.actionActionItemAddFields = actionActionItemAddFields;
const assignedByLookUp = {
    $lookup: {
        from: member_1.default.collection.name,
        let: { assignedById: "$assignedById" },
        pipeline: [
            {
                $match: {
                    $expr: { $eq: ["$_id", { $ifNull: ["$$assignedById", []] }] },
                },
            },
        ],
        as: "assignedBy",
    },
};
exports.assignedByLookUp = assignedByLookUp;
const assignedToLookUp = {
    $lookup: {
        from: member_1.default.collection.name,
        let: { assignedToId: "$assignedToId" },
        pipeline: [
            {
                $match: {
                    $expr: { $eq: ["$_id", { $ifNull: ["$$assignedToId", []] }] },
                },
            },
        ],
        as: "assignedTo",
    },
};
exports.assignedToLookUp = assignedToLookUp;
const actionItemsLookup = {
    $lookup: {
        from: actionItem_1.default.collection.name,
        let: { actionItems: "$actionItems" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$actionItems", []] }] },
                },
            },
            {
                $sort: { _id: -1 },
            },
            {
                $lookup: {
                    from: action_1.default.collection.name,
                    let: { actionId: "$actionId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$_id", "$$actionId"] },
                            },
                        },
                    ],
                    as: "action",
                },
            },
            {
                $unwind: {
                    path: "$action",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ],
        as: "actionItems",
    },
};
exports.actionItemsLookup = actionItemsLookup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uSXRlbUZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL2FjdGlvbkl0ZW1GaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhEQUFzQztBQUN0QyxzRUFBOEM7QUFDOUMsOERBQXNDO0FBRXRDLE1BQU0sbUJBQW1CLEdBQUc7SUFDMUIsVUFBVSxFQUFFO1FBQ1YsV0FBVyxFQUFFLGNBQWM7UUFDM0IsZ0JBQWdCLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM5RCxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO1FBQ3hDLFVBQVUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7UUFDaEQsVUFBVSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtLQUNqRDtDQUNGLENBQUM7QUE4RUEsa0RBQW1CO0FBNUVyQixNQUFNLHlCQUF5QixHQUFHO0lBQ2hDLFVBQVUsRUFBRTtRQUNWLFdBQVcsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3pELFdBQVcsRUFBRSxFQUFFO0tBQ2hCO0NBQ0YsQ0FBQztBQXdFQSw4REFBeUI7QUF0RTNCLE1BQU0sZ0JBQWdCLEdBQUc7SUFDdkIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGdCQUFNLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDNUIsR0FBRyxFQUFFLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRTtRQUN0QyxRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2lCQUM5RDthQUNGO1NBQ0Y7UUFDRCxFQUFFLEVBQUUsWUFBWTtLQUNqQjtDQUNGLENBQUM7QUEwREEsNENBQWdCO0FBeERsQixNQUFNLGdCQUFnQixHQUFHO0lBQ3ZCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQzVCLEdBQUcsRUFBRSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUU7UUFDdEMsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtpQkFDOUQ7YUFDRjtTQUNGO1FBQ0QsRUFBRSxFQUFFLFlBQVk7S0FDakI7Q0FDRixDQUFDO0FBNENBLDRDQUFnQjtBQTFDbEIsTUFBTSxpQkFBaUIsR0FBRztJQUN4QixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsb0JBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUNoQyxHQUFHLEVBQUUsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFO1FBQ3BDLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2lCQUM3RDthQUNGO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFO2FBQ25CO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFO29CQUNQLElBQUksRUFBRSxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJO29CQUM1QixHQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFO29CQUM5QixRQUFRLEVBQUU7d0JBQ1I7NEJBQ0UsTUFBTSxFQUFFO2dDQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsRUFBRTs2QkFDdkM7eUJBQ0Y7cUJBQ0Y7b0JBQ0QsRUFBRSxFQUFFLFFBQVE7aUJBQ2I7YUFDRjtZQUNEO2dCQUNFLE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUsU0FBUztvQkFDZiwwQkFBMEIsRUFBRSxJQUFJO2lCQUNqQzthQUNGO1NBQ0Y7UUFDRCxFQUFFLEVBQUUsYUFBYTtLQUNsQjtDQUNGLENBQUM7QUFPQSw4Q0FBaUIifQ==