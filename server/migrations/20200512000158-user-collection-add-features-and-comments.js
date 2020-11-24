module.exports = {
  async up(db, client) {
    await db
      .collection("users")
      .updateMany(
        {},
        { $set: { features: [], comments: [] } },
        { upsert: false, multi: true }
      );
  },

  async down(db, client) {
    // Rollback migration (if possible)
    await db
      .collection("users")
      .updateMany({}, { $unset: { features: [], comments: [] } });
  },
};
