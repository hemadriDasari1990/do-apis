declare const actionsLookup: {
    $lookup: {
        from: string;
        let: {
            actions: string;
        };
        pipeline: ({
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
declare const actionAddFields: {
    $addFields: {
        actions: string;
        totalActions: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
    };
};
export { actionsLookup, actionAddFields };
