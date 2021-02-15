declare const departmentsLookup: {
    $lookup: {
        from: string;
        let: {
            departments: string;
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
                    projects: string;
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
                totalProjects: {
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
declare const organizationAddFields: {
    $addFields: {
        departments: string;
        totalDepartments: {
            $size: {
                $ifNull: (string | number)[];
            };
        };
    };
};
export { departmentsLookup, organizationAddFields };
