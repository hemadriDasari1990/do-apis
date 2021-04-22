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
        createdBy: {
            $ifNull: (string | null[])[];
        };
        updatedBy: {
            $ifNull: (string | null[])[];
        };
    };
};
declare const sectionNoteAddFields: {
    $addFields: {
        totalNotes: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        notes: never[];
    };
};
declare const createdByLookUp: {
    $lookup: {
        from: string;
        let: {
            createdById: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $eq: (string | {
                        $ifNull: (string | never[])[];
                    })[];
                };
            };
        }[];
        as: string;
    };
};
declare const updatedByLookUp: {
    $lookup: {
        from: string;
        let: {
            updatedById: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $eq: (string | {
                        $ifNull: (string | never[])[];
                    })[];
                };
            };
        }[];
        as: string;
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
};
export { noteAddFields, notesLookup, createdByLookUp, updatedByLookUp, sectionNoteAddFields, };
