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
                private: boolean;
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
                private: boolean;
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
    };
};
export { projectsLookup, projectAddFields, inActiveProjectsLookup, activeProjectsLookup, publicProjectsLookup, privateProjectsLookup, };
