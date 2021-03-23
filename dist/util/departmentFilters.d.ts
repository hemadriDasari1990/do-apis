declare const departmentsLookup: {
    $lookup: {
        from: string;
        let: {
            departments: string;
        };
        pipeline: ({
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
                        } | {
                            $sort: {
                                _id: number;
                            };
                            $match?: undefined;
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
        } | {
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
        } | {
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
declare const inActiveDepartmentsLookup: {
    $lookup: {
        from: string;
        let: {
            departments: string;
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
declare const activeDepartmentsLookup: {
    $lookup: {
        from: string;
        let: {
            departments: string;
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
declare const departmentAddFields: {
    $addFields: {
        departments: string;
        activeDepartments: string;
        inActiveDepartments: string;
        totalDepartments: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalActiveDepartments: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalInActiveDepartments: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
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
    };
};
export { departmentsLookup, inActiveDepartmentsLookup, activeDepartmentsLookup, departmentAddFields, };
