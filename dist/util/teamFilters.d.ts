declare const teamsLookup: {
    $lookup: {
        from: string;
        let: {
            teams: string;
        };
        pipeline: ({
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
        } | {
            $addFields: {
                members: string;
                totalMembers: {
                    $size: {
                        $ifNull: (string | never[])[];
                    };
                };
            };
        } | {
            $match: {
                $expr: {
                    $in: (string | {
                        $ifNull: (string | never[])[];
                    })[];
                };
            };
            $sort?: undefined;
        } | {
            $sort: {
                _id: number;
            };
            $match?: undefined;
        })[];
        as: string;
    };
};
declare const inActiveTeamsLookup: {
    $lookup: {
        from: string;
        let: {
            teams: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $in: (string | {
                        $ifNull: (string | never[])[];
                    })[];
                };
                status: string;
            };
        }[];
        as: string;
    };
};
declare const activeTeamsLookup: {
    $lookup: {
        from: string;
        let: {
            teams: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $in: (string | {
                        $ifNull: (string | never[])[];
                    })[];
                };
                status: string;
            };
        }[];
        as: string;
    };
};
declare const teamAddFields: {
    $addFields: {
        members: string;
        activeMembers: string;
        inActiveMembers: string;
        totalMembers: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalActiveMembers: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalInActiveMembers: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        teams: string;
        activeTeams: string;
        inActiveTeams: string;
        totalTeams: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalActiveTeams: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalInActiveTeams: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
    };
};
export { teamsLookup, inActiveTeamsLookup, activeTeamsLookup, teamAddFields };
