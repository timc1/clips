import mongoose from "mongoose";

// MongoDB case insensitive collation: https://stackoverflow.com/a/40914924
export const CASE_INSENSITIVE_COLLATION = { locale: "en", strength: 2 };

const connectDb = (handler) => async (req, res) => {
  try {
    if (mongoose.connections[0].readyState) return handler(req, res);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return handler(req, res);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDb;
