declare const teamMemberTeamsLookup: {
    $lookup: {
        from: string;
        let: {
            teams: string;
        };
        pipeline: ({
            $lookup: {
                from: string;
                let: {
                    memberId: string;
                };
                pipeline: {
                    $match: {
                        $expr: {
                            $eq: string[];
                        };
                    };
                }[];
                as: string;
            };
        } | {
            $lookup: {
                from: string;
                let: {
                    teamId: string;
                };
                pipeline: {
                    $match: {
                        $expr: {
                            $eq: string[];
                        };
                    };
                }[];
                as: string;
            };
        } | {
            $match: {
                $expr: {
                    $in: (string | {
                        $ifNull: (string | never[])[];
                    })[];
                };
            };
            $unwind?: undefined;
        } | {
            $unwind: string;
            $match?: undefined;
        })[];
        as: string;
    };
};
declare const teamMemberMembersLookup: {
    $lookup: {
        from: string;
        let: {
            members: string;
        };
        pipeline: ({
            $lookup: {
                from: string;
                let: {
                    memberId: string;
                };
                pipeline: {
                    $match: {
                        $expr: {
                            $eq: string[];
                        };
                    };
                }[];
                as: string;
            };
        } | {
            $lookup: {
                from: string;
                let: {
                    teamId: string;
                };
                pipeline: {
                    $match: {
                        $expr: {
                            $eq: string[];
                        };
                    };
                }[];
                as: string;
            };
        } | {
            $match: {
                $expr: {
                    $in: (string | {
                        $ifNull: (string | never[])[];
                    })[];
                };
            };
            $unwind?: undefined;
        } | {
            $unwind: string;
            $match?: undefined;
        })[];
        as: string;
    };
};
declare const teamMemberTeamsAddFields: {
    $addFields: {
        teams: string;
        totalTeams: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
    };
};
declare const teamMemberMembersAddFields: {
    $addFields: {
        members: string;
        totalMembers: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
    };
};
export { teamMemberMembersAddFields, teamMemberTeamsAddFields, teamMemberTeamsLookup, teamMemberMembersLookup, };
