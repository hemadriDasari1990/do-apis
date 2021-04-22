declare const actionItemAddFields: {
    $addFields: {
        actionItems: string;
        totalActionItems: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        action: {
            $ifNull: (string | null[])[];
        };
        assignedBy: {
            $ifNull: (string | null[])[];
        };
        assignedTo: {
            $ifNull: (string | null[])[];
        };
    };
};
declare const actionActionItemAddFields: {
    $addFields: {
        totalAction: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        actionItems: never[];
    };
};
declare const assignedByLookUp: {
    $lookup: {
        from: string;
        let: {
            assignedById: string;
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
declare const assignedToLookUp: {
    $lookup: {
        from: string;
        let: {
            assignedToId: string;
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
declare const actionItemsLookup: {
    $lookup: {
        from: string;
        let: {
            actionItems: string;
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
                    actionId: string;
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
export { actionItemAddFields, actionActionItemAddFields, assignedByLookUp, assignedToLookUp, actionItemsLookup, };
