declare const userLookup: {
    $lookup: {
        from: string;
        let: {
            userId: string;
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
};
export { userLookup };
