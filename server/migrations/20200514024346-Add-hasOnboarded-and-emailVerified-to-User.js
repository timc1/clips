module.exports = {
  async up(db, client) {
    await db
      .collection("users")
      .updateMany(
        {},
        { $set: { hasOnboarded: false, emailVerified: false } },
        { upsert: false, multi: true }
      );
  },

  async down(db, client) {
    await db
      .collection("users")
      .updateMany(
        {},
        { $set: { hasOnboarded: undefined, emailVerified: undefined } },
        { upsert: false, multi: true }
      );
  },
};
