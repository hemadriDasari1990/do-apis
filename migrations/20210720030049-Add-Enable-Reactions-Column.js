module.exports = {
  async up(db, client) {
    db.getCollection("board").updateMany(
      {},
      { $set: { enableReactions: false } }
    );
  },

  async down(db, client) {
    db.getCollection("board").updateMany(
      {},
      { $unset: { enableReactions: false } }
    );
  },
};
