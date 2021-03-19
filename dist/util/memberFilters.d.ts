declare const memberLookup: {
    $lookup: {
        from: string;
        let: {
            reactedBy: string;
        };
        pipeline: ({
            $lookup: {
                from: string;
                let: {
                    teams: string;
                };
                pipeline: ({
                    $lookup: {
                        from: string;
                        let: {
                            member: string;
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
                            team: string;
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
            $match: {
                $expr: {
                    $eq: string[];
                };
            };
        })[];
        as: string;
    };
};
declare const membersLookup: {
    $lookup: {
        from: string;
        let: {
            members: string;
        };
        pipeline: ({
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
declare const inActiveMemberLookup: {
    $lookup: {
        from: string;
        let: {
            members: string;
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
declare const activeMemberLookup: {
    $lookup: {
        from: string;
        let: {
            members: string;
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
declare const memberAddFields: {
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
    };
};
export { membersLookup, inActiveMemberLookup, activeMemberLookup, memberLookup, memberAddFields, };
