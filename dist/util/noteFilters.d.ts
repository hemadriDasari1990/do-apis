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
declare const reactionAgreeLookup: {
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
declare const noteAddFields: {
    $addFields: {
        totalReactions: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalAgreed: {
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
export { noteAddFields, reactionLookup, reactionAgreeLookup, reactionDisAgreeLookup, reactionLoveLookup };
