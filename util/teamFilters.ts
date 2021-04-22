import {
  teamMemberMembersAddFields,
  teamMemberMembersLookup,
} from "./teamMemberFilters";

import Team from "../models/team";

const teamLookup = {
  $lookup: {
    from: Team.collection.name,
    let: { teamId: "$teamId" },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$_id", "$$teamId"] },
        },
      },
      teamMemberMembersLookup,
      teamMemberMembersAddFields,
    ],
    as: "team",
  },
};

const teamsLookup = {
  $lookup: {
    from: Team.collection.name,
    let: { teams: "$teams" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$teams", []] }] },
        },
      },
      {
        $sort: { _id: 1 },
      },
      teamMemberMembersLookup,
      teamMemberMembersAddFields,
    ],
    as: "teams",
  },
};

const inActiveTeamsLookup = {
  $lookup: {
    from: Team.collection.name,
    let: { teams: "$teams" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$teams", []] }] },
          status: "inactive",
        },
      },
    ],
    as: "inActiveTeams",
  },
};

const activeTeamsLookup = {
  $lookup: {
    from: Team.collection.name,
    let: { teams: "$teams" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$teams", []] }] },
          status: "active",
        },
      },
    ],
    as: "activeTeams",
  },
};

const teamAddFields = {
  $addFields: {
    members: "$members",
    activeMembers: "$activeMembers",
    inActiveMembers: "$inActiveMembers",
    totalMembers: { $size: { $ifNull: ["$members", []] } },
    totalActiveMembers: { $size: { $ifNull: ["$activeMembers", []] } },
    totalInActiveMembers: {
      $size: { $ifNull: ["$inActiveMembers", []] },
    },
    teams: "$teams",
    activeTeams: "$activeTeams",
    inActiveTeams: "$inActiveTeams",
    totalTeams: { $size: { $ifNull: ["$teams", []] } },
    totalActiveTeams: { $size: { $ifNull: ["$activeTeams", []] } },
    totalInActiveTeams: { $size: { $ifNull: ["$inActiveTeams", []] } },
  },
};

export {
  teamsLookup,
  inActiveTeamsLookup,
  activeTeamsLookup,
  teamAddFields,
  teamLookup,
};
