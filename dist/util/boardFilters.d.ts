declare const boardsLookup: {
    $lookup: {
        from: string;
        let: {
            boards: string;
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
        } | {
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
        } | {
            $lookup: {
                from: string;
                let: {
                    sections: string;
                };
                pipeline: ({
                    $lookup: {
                        from: string;
                        let: {
                            notes: string;
                        };
                        pipeline: ({
                            $lookup: {
                                from: string;
                                let: {
                                    reactions: string;
                                };
                                pipeline: ({
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
                                            $match: {
                                                $expr: {
                                                    $eq: string[];
                                                };
                                            };
                                        })[];
                                        as: string;
                                    };
                                } | {
                                    $match: {
                                        $expr: {
                                            $in: (string | {
                                                $ifNull: (string | never[])[];
                                            })[];
                                        };
                                        type: string;
                                    };
                                    $unwind?: undefined;
                                } | {
                                    $unwind: {
                                        path: string;
                                        preserveNullAndEmptyArrays: boolean;
                                    };
                                    $match?: undefined;
                                })[];
                                as: string;
                            };
                        } | {
                            $lookup: {
                                from: string;
                                let: {
                                    reactions: string;
                                };
                                pipeline: ({
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
                                            $match: {
                                                $expr: {
                                                    $eq: string[];
                                                };
                                            };
                                        })[];
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
                                    $sort?: undefined;
                                    $unwind?: undefined;
                                } | {
                                    $sort: {
                                        _id: number;
                                    };
                                    $match?: undefined;
                                    $unwind?: undefined;
                                } | {
                                    $unwind: {
                                        path: string;
                                        preserveNullAndEmptyArrays: boolean;
                                    };
                                    $match?: undefined;
                                    $sort?: undefined;
                                })[];
                                as: string;
                            };
                        } | {
                            $addFields: {
                                notes: string;
                                totalNotes: {
                                    $size: {
                                        $ifNull: (string | never[])[];
                                    };
                                };
                                section: {
                                    $ifNull: (string | null[])[];
                                };
                                createdBy: {
                                    $ifNull: (string | null[])[];
                                };
                                updatedBy: {
                                    $ifNull: (string | null[])[];
                                };
                            };
                        } | {
                            $addFields: {
                                totalReactions: {
                                    $size: {
                                        $ifNull: (string | never[])[];
                                    };
                                };
                                totalPlusOne: {
                                    $size: {
                                        $ifNull: (string | never[])[];
                                    };
                                };
                                totalPlusTwo: {
                                    $size: {
                                        $ifNull: (string | never[])[];
                                    };
                                };
                                totalDeserve: {
                                    $size: {
                                        $ifNull: (string | never[])[];
                                    };
                                };
                                totalMinusOne: {
                                    $size: {
                                        $ifNull: (string | never[])[];
                                    };
                                };
                                totalLove: {
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
                            $lookup?: undefined;
                            $unwind?: undefined;
                        } | {
                            $sort: {
                                _id: number;
                            };
                            $match?: undefined;
                            $lookup?: undefined;
                            $unwind?: undefined;
                        } | {
                            $lookup: {
                                from: string;
                                let: {
                                    sectionId: string;
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
                            $match?: undefined;
                            $sort?: undefined;
                            $unwind?: undefined;
                        } | {
                            $unwind: {
                                path: string;
                                preserveNullAndEmptyArrays: boolean;
                            };
                            $match?: undefined;
                            $sort?: undefined;
                            $lookup?: undefined;
                        })[];
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
                    $sort?: undefined;
                } | {
                    $sort: {
                        _id: number;
                    };
                    $match?: undefined;
                })[];
                as: string;
            };
        } | {
            $addFields: {
                sections: string;
                totalSections: {
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
            $lookup?: undefined;
            $unwind?: undefined;
        } | {
            $sort: {
                _id: number;
            };
            $match?: undefined;
            $lookup?: undefined;
            $unwind?: undefined;
        } | {
            $lookup: {
                from: string;
                let: {
                    projectId: string;
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
            $match?: undefined;
            $sort?: undefined;
            $unwind?: undefined;
        } | {
            $unwind: {
                path: string;
                preserveNullAndEmptyArrays: boolean;
            };
            $match?: undefined;
            $sort?: undefined;
            $lookup?: undefined;
        })[];
        as: string;
    };
};
declare const inProgressBoardsLookup: {
    $lookup: {
        from: string;
        let: {
            boards: string;
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
declare const completedBoardsLookup: {
    $lookup: {
        from: string;
        let: {
            boards: string;
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
declare const newBoardsLookup: {
    $lookup: {
        from: string;
        let: {
            boards: string;
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
declare const boardAddFields: {
    $addFields: {
        boards: string;
        inProgressBoards: string;
        newBoards: string;
        completedBoards: string;
        totalBoards: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalInProgressBoards: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalNewBoards: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalCompletedBoards: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
    };
};
export { boardsLookup, boardAddFields, newBoardsLookup, inProgressBoardsLookup, completedBoardsLookup, };
