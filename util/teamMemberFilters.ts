import Member from "../models/member";
import Team from "../models/team";
import TeamMember from "../models/teamMember";

const memberLookUp = {
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

const teamLookUp = {
  $lookup: {
    from: Team.collection.name,
    let: { teamId: "$teamId" },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$_id", "$$teamId"] },
        },
      },
    ],
    as: "team",
  },
};

const teamMemberTeamsLookup = {
  $lookup: {
    from: TeamMember.collection.name,
    let: { teams: "$teams" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$teams", []] }] },
        },
      },
      memberLookUp,
      teamLookUp,
      { $unwind: "$member" },
      { $unwind: "$team" },
    ],
    as: "teams",
  },
};

const teamMemberMembersLookup = {
  $lookup: {
    from: TeamMember.collection.name,
    let: { members: "$members" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$members", []] }] },
        },
      },
      memberLookUp,
      teamLookUp,
      { $unwind: "$member" },
      { $unwind: "$team" },
    ],
    as: "members",
  },
};

const teamMemberTeamsAddFields = {
  $addFields: {
    teams: "$teams",
    totalTeams: { $size: { $ifNull: ["$teams", []] } },
  },
};

const teamMemberMembersAddFields = {
  $addFields: {
    members: "$members",
    totalMembers: { $size: { $ifNull: ["$members", []] } },
  },
};

export {
  teamMemberMembersAddFields,
  teamMemberTeamsAddFields,
  teamMemberTeamsLookup,
  teamMemberMembersLookup,
};
