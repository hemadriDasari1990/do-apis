declare const reactionLookup: {
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
};
declare const reactionPlusOneLookup: {
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
};
declare const reactionPlusTwoLookup: {
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
};
declare const reactionDeserveLookup: {
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
};
declare const reactionDisAgreeLookup: {
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
};
declare const reactionLoveLookup: {
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
};
declare const reactionAddFields: {
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
};
export { reactionLookup, reactionPlusOneLookup, reactionPlusTwoLookup, reactionDeserveLookup, reactionDisAgreeLookup, reactionLoveLookup, reactionAddFields, };
