"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMemberIds = void 0;
exports.getMemberIds = (members) => {
    if (!members || !(members === null || members === void 0 ? void 0 : members.length)) {
        return [];
    }
    const newMembers = [];
    members.map((memberProxy) => {
        var _a;
        newMembers.push((_a = memberProxy === null || memberProxy === void 0 ? void 0 : memberProxy.member) === null || _a === void 0 ? void 0 : _a._id);
    });
    return newMembers === null || newMembers === void 0 ? void 0 : newMembers.filter((elem, index, self) => self.findIndex((t) => {
        return t === elem;
    }) === index);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVtYmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdXRpbC9tZW1iZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSxZQUFZLEdBQUcsQ0FBQyxPQUFzQyxFQUFFLEVBQUU7SUFDckUsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFDLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxNQUFNLENBQUEsRUFBRTtRQUNoQyxPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsTUFBTSxVQUFVLEdBQWtCLEVBQUUsQ0FBQztJQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBbUMsRUFBRSxFQUFFOztRQUNsRCxVQUFVLENBQUMsSUFBSSxPQUFDLFdBQVcsYUFBWCxXQUFXLHVCQUFYLFdBQVcsQ0FBRSxNQUFNLDBDQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxVQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsTUFBTSxDQUN2QixDQUFDLElBQVksRUFBRSxLQUFhLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFO1FBQzNCLE9BQU8sQ0FBQyxLQUFLLElBQUksQ0FBQztJQUNwQixDQUFDLENBQUMsS0FBSyxLQUFLLEVBQ2Q7QUFDSixDQUFDLENBQUMifQ==