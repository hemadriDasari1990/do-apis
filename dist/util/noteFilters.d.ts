declare const noteAddFields: {
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
    };
};
declare const notesLookup: {
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
                totalDisAgreed: {
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
            $unwind: string;
            $match?: undefined;
            $sort?: undefined;
            $lookup?: undefined;
        })[];
        as: string;
    };
};
export { noteAddFields, notesLookup };
