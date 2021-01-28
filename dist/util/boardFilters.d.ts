declare const sectionsLookup: {
    $lookup: {
        from: string;
        let: {
            sections: string;
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
declare const boardAddFields: {
    $addFields: {
        sections: string;
        totalSections: {
            $size: {
                $ifNull: (string | number)[];
            };
        };
    };
};
export { sectionsLookup, boardAddFields };
