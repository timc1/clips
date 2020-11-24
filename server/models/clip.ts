import mongoose from "mongoose";
import Comment from "./comment";

let Clip;

try {
  if (mongoose.model("Clip")) {
    Clip = mongoose.model("Clip");
  }
} catch (e) {
  if (e.name === "MissingSchemaError") {
    const ClipSchema = new mongoose.Schema(
      {
        articleId: {
          type: String,
          required: true,
        },
        authorId: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        title: {
          type: String,
        },
        markdown: {
          type: String,
        },
        linkMetadata: {
          type: Object,
        },
        images: {
          type: Array,
        },
        comments: {
          type: [mongoose.Schema.Types.ObjectId],
        },
        invitations: {
          type: [mongoose.Schema.Types.ObjectId],
        },
        isRemoved: {
          type: Boolean,
          default: false,
        },
        visibility: {
          type: String,
          enum: ["private", "public"],
          default: "private",
        },
      },
      { timestamps: true }
    );

    ClipSchema.statics.doesNotExist = async function (field) {
      return (await this.where(field).countDocuments()) === 0;
    };

    ClipSchema.methods.removeCommentFromClip = async function (
      commentId: string,
      userId: string
    ) {
      if (this.authorId !== userId) {
        return { permissionDenied: true };
      }

      return await Clip.findByIdAndUpdate(
        this.id,
        {
          $pull: { comments: commentId },
          useFindAndModify: false,
        },
        { new: true, timestamps: false }
      );
    };

    ClipSchema.methods.getComments = async function () {
      return await Comment.find({
        _id: { $in: this.comments },
      }).sort({
        createdAt: -1,
      });
    };

    ClipSchema.methods.deleteClip = async function () {
      const clipId = this._id;
      return await Clip.findByIdAndUpdate(
        clipId,
        {
          $set: { isRemoved: true },
          useFindAndModify: false,
        },
        { new: true }
      );
    };

    ClipSchema.methods.addInvitation = async function (invitationId: string) {
      const clipId = this._id;
      return await Clip.findByIdAndUpdate(
        clipId,
        {
          $push: {
            invitations: invitationId,
          },
        },
        { new: true }
      );
    };

    ClipSchema.methods.removeInvitation = async function (
      invitationId: string,
      userId: string
    ) {
      if (this.authorId !== userId) {
        return { permissionDenied: true };
      }

      return await Clip.findByIdAndUpdate(
        this.id,
        {
          $pull: { invitations: invitationId },
          useFindAndModify: false,
        },
        { new: true, timestamps: false }
      );
    };

    Clip = mongoose.model("Clip", ClipSchema);
  }
}

export default Clip;
