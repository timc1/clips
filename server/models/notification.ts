import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

let Notification;

try {
  if (mongoose.model("Notification")) {
    Notification = mongoose.model("Notification");
  }
} catch (e) {
  if (e.name === "MissingSchemaError") {
    const NotificationSchema = new mongoose.Schema(
      {
        type: {
          type: String,
          required: true,
        },
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        receiver: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        readAt: {
          type: Date,
        },
        payload: {
          type: Object,
          required: true,
        },
      },
      { timestamps: true }
    );

    NotificationSchema.methods.markAsRead = async function (userId: string) {
      if (!this.receiver.equals(userId)) {
        return { permissionDenied: true };
      }

      return await Notification.findByIdAndUpdate(
        this._id,
        {
          $set: { readAt: new Date() },
          useFindAndModify: false,
        },
        { new: true }
      );
    };

    NotificationSchema.plugin(mongooseAggregatePaginate);

    Notification = mongoose.model("Notification", NotificationSchema);
  }
}

export default Notification;
