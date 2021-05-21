module.exports = {
  async up(db, client) {
    await db.collection('securityquestions').insertMany([{
      name: "What is your favourite color?"
    }, {
      name: "What is your favourite city?"
    }, {
      name: "What is your favourite country"
    }]);
  },

  async down(db, client) {
    await db.collection('securityquestions').drop();
  }
};