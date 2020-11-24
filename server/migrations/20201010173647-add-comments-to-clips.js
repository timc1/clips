module.exports = {
  async up(db, client) {
    await db
      .collection("clips")
      .updateMany(
        {},
        { $set: { comments: [] } },
        { upsert: false, multi: true }
      );
  },

  async down(db, client) {
    // Rollback migration (if possible)
    await db
      .collection("clips")
      .updateMany({}, { $unset: { comments: undefined } });
  },
};
