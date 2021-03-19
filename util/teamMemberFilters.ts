import Member from "../models/member";
import Team from "../models/team";
import TeamMember from "../models/teamMember";

const memberLookUp = {
  $lookup: {
    from: Member.collection.name,
    let: { member: "$member" },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$_id", "$$member"] },
        },
      },
    ],
    as: "member",
  },
};

const teamLookUp = {
  $lookup: {
    from: Team.collection.name,
    let: { team: "$team" },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$_id", "$$team"] },
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
