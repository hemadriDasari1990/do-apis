"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionAddFields = exports.actionsLookup = void 0;
const action_1 = __importDefault(require("../models/action"));
const actionItemFilters_1 = require("./actionItemFilters");
const actionsLookup = {
    $lookup: {
        from: action_1.default.collection.name,
        let: { actions: "$actions" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$actions", []] }] },
                },
            },
            {
                $sort: { _id: 1 },
            },
            actionItemFilters_1.actionItemsLookup,
        ],
        as: "actions",
    },
};
exports.actionsLookup = actionsLookup;
const actionAddFields = {
    $addFields: {
        actions: "$actions",
        totalActions: { $size: { $ifNull: ["$actions", []] } },
    },
};
exports.actionAddFields = actionAddFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uRmlsdGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3V0aWwvYWN0aW9uRmlsdGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw4REFBc0M7QUFDdEMsMkRBQXdEO0FBRXhELE1BQU0sYUFBYSxHQUFHO0lBQ3BCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQzVCLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUU7UUFDNUIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7aUJBQ3pEO2FBQ0Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFO2FBQ2xCO1lBQ0QscUNBQWlCO1NBQ2xCO1FBQ0QsRUFBRSxFQUFFLFNBQVM7S0FDZDtDQUNGLENBQUM7QUFTTyxzQ0FBYTtBQVB0QixNQUFNLGVBQWUsR0FBRztJQUN0QixVQUFVLEVBQUU7UUFDVixPQUFPLEVBQUUsVUFBVTtRQUNuQixZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtLQUN2RDtDQUNGLENBQUM7QUFFc0IsMENBQWUifQ==