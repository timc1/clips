module.exports = {
  async up(db, client) {
    await db
      .collection("users")
      .updateMany(
        {},
        { $set: { profileImage: "" } },
        { upsert: false, multi: true }
      );
  },

  async down(db, client) {
    // Rollback migration (if possible)
    await db
      .collection("users")
      .updateMany({}, { $unset: { profileImage: undefined } });
  },
};
