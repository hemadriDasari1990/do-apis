declare const boardsLookup: {
    $lookup: {
        from: string;
        let: {
            boards: string;
        };
        pipeline: ({
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
        } | {
            $addFields: {
                sections: string;
                totalSections: {
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
declare const inProgressBoardsLookup: {
    $lookup: {
        from: string;
        let: {
            boards: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $in: (string | {
                        $ifNull: (string | never[])[];
                    })[];
                };
                status: string;
            };
        }[];
        as: string;
    };
};
declare const completedBoardsLookup: {
    $lookup: {
        from: string;
        let: {
            boards: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $in: (string | {
                        $ifNull: (string | never[])[];
                    })[];
                };
                status: string;
            };
        }[];
        as: string;
    };
};
declare const newBoardsLookup: {
    $lookup: {
        from: string;
        let: {
            boards: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $in: (string | {
                        $ifNull: (string | never[])[];
                    })[];
                };
                status: string;
            };
        }[];
        as: string;
    };
};
declare const boardAddFields: {
    $addFields: {
        boards: string;
        inProgressBoards: string;
        newBoards: string;
        completedBoards: string;
        totalBoards: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalInProgressBoards: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalNewBoards: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
        totalCompletedBoards: {
            $size: {
                $ifNull: (string | never[])[];
            };
        };
    };
};
export { boardsLookup, boardAddFields, newBoardsLookup, inProgressBoardsLookup, completedBoardsLookup, };
