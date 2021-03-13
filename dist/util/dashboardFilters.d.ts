declare const dashboardLookup: {
    activeDepartmentsLookup: {
        $lookup: {
            from: string;
            let: {
                activeDepartments: string;
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
    inActiveDepartmentsLookup: {
        $lookup: {
            from: string;
            let: {
                inActiveDepartments: string;
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
    activeProjectsLookup: {
        $lookup: {
            from: string;
            let: {
                activeProjects: string;
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
    inActiveProjectsLookup: {
        $lookup: {
            from: string;
            let: {
                inActiveProjects: string;
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
    privateProjectsLookup: {
        $lookup: {
            from: string;
            let: {
                privateProjects: string;
            };
            pipeline: {
                $match: {
                    $expr: {
                        $in: (string | {
                            $ifNull: (string | never[])[];
                        })[];
                    };
                    private: boolean;
                };
            }[];
            as: string;
        };
    };
    publicProjectsLookup: {
        $lookup: {
            from: string;
            let: {
                publicProjects: string;
            };
            pipeline: {
                $match: {
                    $expr: {
                        $in: (string | {
                            $ifNull: (string | never[])[];
                        })[];
                    };
                    private: boolean;
                };
            }[];
            as: string;
        };
    };
    inProgressBoardsLookup: {
        $lookup: {
            from: string;
            let: {
                inProgressBoards: string;
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
    newBoardsLookup: {
        $lookup: {
            from: string;
            let: {
                newBoards: string;
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
    completedBoardsLookup: {
        $lookup: {
            from: string;
            let: {
                completedBoards: string;
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
};
declare const addFields: {
    $addFields: {
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
export { dashboardLookup, addFields };
