declare const userLookup: {
    $lookup: {
        from: string;
        let: {
            userId: string;
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
};
declare const projectLookup: {
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
};
declare const projectsLookup: {
    $lookup: {
        from: string;
        let: {
            projects: string;
        };
        pipeline: ({
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
                                        totalHighlight: {
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
        } | {
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
        } | {
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
        } | {
            $lookup: {
                from: string;
                let: {
                    userId: string;
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
};
declare const inActiveProjectsLookup: {
    $lookup: {
        from: string;
        let: {
            projects: string;
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
declare const activeProjectsLookup: {
    $lookup: {
        from: string;
        let: {
            projects: string;
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
declare const publicProjectsLookup: {
    $lookup: {
        from: string;
        let: {
            projects: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $in: (string | {
                        $ifNull: (string | never[])[];
                    })[];
                };
                isPrivate: boolean;
            };
        }[];
        as: string;
    };
};
declare const privateProjectsLookup: {
    $lookup: {
        from: string;
        let: {
            projects: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $in: (string | {
                        $ifNull: (string | never[])[];
                    })[];
                };
                isPrivate: boolean;
            };
        }[];
        as: string;
    };
};
declare const projectAddFields: {
    $addFields: {
        projects: string;
        activeProjects: string;
        inActiveProjects: string;
        privateProjects: string;
        publicProjects: string;
        totalProjects: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalActiveProjects: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalInActiveProjects: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalPrivateProjects: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalPublicProjects: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalBoards: string;
        totalInProgressBoards: string;
        totalNewBoards: string;
        totalCompletedBoards: string;
    };
};
declare const projectAddTotalFields: {
    $addFields: {
        totalProjects: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalActiveProjects: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalInActiveProjects: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalPrivateProjects: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalPublicProjects: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
    };
};
export { projectsLookup, projectAddFields, inActiveProjectsLookup, activeProjectsLookup, publicProjectsLookup, privateProjectsLookup, userLookup, projectAddTotalFields, projectLookup, };
