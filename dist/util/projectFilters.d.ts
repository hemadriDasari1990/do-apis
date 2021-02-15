declare const projectsLookup: {
    $lookup: {
        from: string;
        let: {
            boards: string;
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
            $addFields?: undefined;
        } | {
            $sort: {
                _id: number;
            };
            $match?: undefined;
            $lookup?: undefined;
            $addFields?: undefined;
        } | {
            $lookup: {
                from: string;
                let: {
                    sections: string;
                };
                pipeline: {
                    $match: {
                        $expr: {
                            $in: (string | {
                                $ifNull: (string | never[])[];
                            })[];
                        };
                    };
                }[];
                as: string;
            };
            $match?: undefined;
            $sort?: undefined;
            $addFields?: undefined;
        } | {
            $addFields: {
                totalSections: {
                    $sum: {
                        $size: {
                            $ifNull: (string | never[])[];
                        };
                    };
                };
            };
            $match?: undefined;
            $sort?: undefined;
            $lookup?: undefined;
        })[];
        as: string;
    };
};
declare const projectAddFields: {
    $addFields: {
        boards: string;
        totalBoards: {
            $size: {
                $ifNull: (string | number)[];
            };
        };
    };
};
export { projectsLookup, projectAddFields };
