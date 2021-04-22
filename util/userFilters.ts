import User from "../models/user";

const userLookup = {
  $lookup: {
    from: User.collection.name,
    let: { userId: "$userId" },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$_id", "$$userId"] },
        },
      },
    ],
    as: "user",
  },
};

export { userLookup };
