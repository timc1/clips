module.exports = {
  async up(db, client) {
    await db
      .collection("users")
      .updateMany(
        {},
        { $set: { notifications: [] } },
        { upsert: false, multi: true }
      );
  },

  async down(db, client) {
    // Rollback migration (if possible)
    await db
      .collection("users")
      .updateMany({}, { $unset: { notifications: undefined } });
  },
};
