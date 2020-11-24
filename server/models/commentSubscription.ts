import mongoose from "mongoose";

let CommentSubscription;

try {
  if (mongoose.model("CommentSubscription")) {
    CommentSubscription = mongoose.model("CommentSubscription");
  }
} catch (e) {
  if (e.name === "MissingSchemaError") {
    const CommentSubscriptionSchema = new mongoose.Schema(
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        clipId: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
      { timestamps: true }
    );

    CommentSubscription = mongoose.model(
      "CommentSubscription",
      CommentSubscriptionSchema
    );
  }
}

export default CommentSubscription;
