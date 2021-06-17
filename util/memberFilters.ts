import JoinMember from "../models/join";
import Member from "../models/member";
import { teamMemberTeamsLookup } from "./teamMemberFilters";

const reactedByLookup = {
  $lookup: {
    from: JoinMember.collection.name,
    let: { reactedBy: "$reactedBy" },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$_id", "$$reactedBy"] },
        },
      },
      teamMemberTeamsLookup,
    ],
    as: "reactedBy",
  },
};

const joinedMemberLookUp = {
  $lookup: {
    from: JoinMember.collection.name,
    let: { memberId: "$memberId" },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$_id", { $ifNull: ["$$memberId", []] }] },
        },
      },
    ],
    as: "member",
  },
};

const memberLookup = {
  $lookup: {
    from: Member.collection.name,
    let: { memberId: "$memberId" },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$_id", "$$memberId"] },
        },
      },
    ],
    as: "member",
  },
};

const membersLookup = {
  $lookup: {
    from: Member.collection.name,
    let: { members: "$members" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$members", []] }] },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ],
    as: "members",
  },
};

const inActiveMemberLookup = {
  $lookup: {
    from: Member.collection.name,
    let: { members: "$members" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$members", []] }] },
          status: "inactive",
        },
      },
    ],
    as: "inActiveMembers",
  },
};

const activeMemberLookup = {
  $lookup: {
    from: Member.collection.name,
    let: { members: "$members" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$members", []] }] },
          status: "active",
        },
      },
    ],
    as: "activeMembers",
  },
};

const memberAddFields = {
  $addFields: {
    members: "$members",
    activeMembers: "$activeMembers",
    inActiveMembers: "$inActiveMembers",
    totalMembers: { $size: { $ifNull: ["$members", []] } },
    totalActiveMembers: { $size: { $ifNull: ["$activeMembers", []] } },
    totalInActiveMembers: {
      $size: { $ifNull: ["$inActiveMembers", []] },
    },
  },
};

export {
  membersLookup,
  inActiveMemberLookup,
  activeMemberLookup,
  reactedByLookup,
  memberAddFields,
  memberLookup,
  joinedMemberLookUp,
};
