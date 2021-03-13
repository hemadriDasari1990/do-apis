declare const reactionLookup: {
    $lookup: {
        from: string;
        let: {
            reactions: string;
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
declare const reactionPlusOneLookup: {
    $lookup: {
        from: string;
        let: {
            reactions: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $in: (string | {
                        $ifNull: (string | never[])[];
                    })[];
                };
                type: string;
            };
        }[];
        as: string;
    };
};
declare const reactionPlusTwoLookup: {
    $lookup: {
        from: string;
        let: {
            reactions: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $in: (string | {
                        $ifNull: (string | never[])[];
                    })[];
                };
                type: string;
            };
        }[];
        as: string;
    };
};
declare const reactionDeserveLookup: {
    $lookup: {
        from: string;
        let: {
            reactions: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $in: (string | {
                        $ifNull: (string | never[])[];
                    })[];
                };
                type: string;
            };
        }[];
        as: string;
    };
};
declare const reactionDisAgreeLookup: {
    $lookup: {
        from: string;
        let: {
            reactions: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $in: (string | {
                        $ifNull: (string | never[])[];
                    })[];
                };
                type: string;
            };
        }[];
        as: string;
    };
};
declare const reactionLoveLookup: {
    $lookup: {
        from: string;
        let: {
            reactions: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $in: (string | {
                        $ifNull: (string | never[])[];
                    })[];
                };
                type: string;
            };
        }[];
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
