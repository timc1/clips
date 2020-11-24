module.exports = {
  async up(db, client) {
    await db
      .collection("clips")
      .updateMany(
        {},
        { $set: { linkMetadata: {} } },
        { upsert: false, multi: true }
      );
  },

  async down(db, client) {
    // Rollback migration (if possible)
    await db
      .collection("clips")
      .updateMany({}, { $unset: { linkMetadata: undefined } });
  },
};
