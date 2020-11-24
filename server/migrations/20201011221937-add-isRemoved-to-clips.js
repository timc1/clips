module.exports = {
  async up(db, client) {
    await db
      .collection("clips")
      .updateMany(
        {},
        { $set: { isRemoved: false } },
        { upsert: false, multi: true }
      );
  },

  async down(db, client) {
    await db
      .collection("clips")
      .updateMany({}, { $unset: { isRemoved: undefined } });
  },
};
