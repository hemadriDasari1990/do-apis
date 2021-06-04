module.exports = {
  async up(db, client) {
    await db.collection("defaultsections").insertMany([
      {
        name:
          "What Went Well, What Could Have Been Better, What To Start, What To Stop",
      },
      {
        name: "What Went Well, What Didn't Go Well, Action Items",
      },
      {
        name: "Mad, Sad, Glad",
      },
      {
        name: "Start, Stop, Continue",
      },
      {
        name: "Went Well, To Improve, Action Items",
      },
      {
        name: "To Dicuss, Discussing, Discussed",
      },
      {
        name: "Liked, Learned, Lacked, Longed For",
      },
      {
        name: "Keep, Add, Less, More",
      },
      {
        name: "Drop, Add, Keep, Improve",
      },
      {
        name: "Strengths, Weaknesses, Opportunities, Threats",
      },
      {
        name: "Explorer, Shopper, Vacationer, Prisoner",
      },
      {
        name: "Mistakes, Experiments, Practices, Learnings",
      },
      {
        name: "We Do, We Value",
      },
      {
        name: "Love, Want, Hate, Learn",
      },
      {
        name: "Good, Bad, Better, Best",
      },
      {
        name: "Key Results, Initiatives, Objectives",
      },
      {
        name: "Happy, Meh, Sad",
      },
      {
        name: "Rose, Bud, Thorn",
      },
      {
        name: "Hopes, Fears",
      },
      {
        name:
          "Keep Doing, Start Doing, Stop Doing, Less of, More of, Action Items",
      },
    ]);
  },

  async down(db, client) {
    await db.collection("defaultsections").drop();
  },
};
