import mongoose from "mongoose";
import Clip from "./clip";

let Comment;

try {
  if (mongoose.model("Comment")) {
    Comment = mongoose.model("Comment");
  }
} catch (e) {
  if (e.name === "MissingSchemaError") {
    const CommentSchema = new mongoose.Schema(
      {
        text: {
          type: String,
          required: true,
        },
        clipId: {
          type: String,
          required: true,
        },
        authorId: {
          type: String,
          required: true,
        },
        isRemoved: {
          type: Boolean,
        },
      },
      { timestamps: true }
    );

    CommentSchema.statics.doesNotExist = async function (field) {
      return (await this.where(field).countDocuments()) === 0;
    };

    CommentSchema.methods.deleteCommentByAuthor = async function (
      userId: String
    ) {
      const clip = await Clip.findById(this.clipId);

      if (this.authorId !== userId && userId !== clip.authorId) {
        return { permissionDenied: true };
      }
      const commentId = this._id;
      return await Comment.findByIdAndUpdate(
        commentId,
        {
          $set: { text: "", isRemoved: true },
          useFindAndModify: false,
        },
        { new: true }
      );
    };

    CommentSchema.methods.editCommentByAuthor = async function (
      userId: String,
      newText: String
    ) {
      if (this.authorId !== userId) {
        return { permissionDenied: true };
      }
      const commentId = this._id;
      return await Comment.findByIdAndUpdate(
        commentId,
        {
          $set: { text: newText },
          useFindAndModify: false,
        },
        { new: true }
      );
    };

    Comment = mongoose.model("Comment", CommentSchema);
  }
}

export default Comment;
