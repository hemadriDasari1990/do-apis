declare const sectionsLookup: {
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
        } | {
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
declare const sectionAddFields: {
    $addFields: {
        notes: string;
        totalNotes: {
            $size: {
                $ifNull: (string | number)[];
            };
        };
    };
};
export { sectionsLookup, sectionAddFields };
