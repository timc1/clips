module.exports = {
  async up(db) {
    await db.collection("users").createIndex(
      { username: 1, email: 1 },
      {
        collation: {
          locale: "en",
          strength: 2,
        },
      }
    );
    await db.collection("organizations").createIndex(
      { organizationName: 1 },
      {
        collation: {
          locale: "en",
          strength: 2,
        },
      }
    );
  },
  async down(db) {
    await db.getCollection("users").dropIndex({ username: 1, email: 1 });
    await db.getCollection("organizations").dropIndex({ organizationName: 1 });
  },
};
