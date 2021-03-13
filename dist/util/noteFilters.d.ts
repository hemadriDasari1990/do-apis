declare const noteAddFields: {
    $addFields: {
        notes: string;
        totalNotes: {
            $size: {
                $ifNull: (string | never[])[];
            };
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
            $addFields: {
                notes: string;
                totalNotes: {
                    $size: {
                        $ifNull: (string | never[])[];
                    };
                };
            };
        } | {
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
export { noteAddFields, notesLookup };
