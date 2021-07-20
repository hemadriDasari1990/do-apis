module.exports = {
  async up(db, client) {
    db.collection("board").updateMany({}, { $set: { enableReactions: false } });
  },

  async down(db, client) {
    db.collection("board").updateMany(
      {},
      { $unset: { enableReactions: false } }
    );
  },
};
