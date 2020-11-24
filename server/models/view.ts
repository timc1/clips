import mongoose from "mongoose";

let View;

try {
  if (mongoose.model("View")) {
    View = mongoose.model("View");
  }
} catch (e) {
  if (e.name === "MissingSchemaError") {
    const ViewSchema = new mongoose.Schema(
      {
        clipId: {
          type: String,
        },
        count: {
          type: Number,
          default: 1,
        },
      },
      { timestamps: true }
    );

    ViewSchema.methods.increment = async function () {
      return await View.findByIdAndUpdate(
        this._id,
        {
          $set: {
            count: this.count + 1,
          },
          useFindAndModify: false,
        },
        { new: true }
      );
    };

    View = mongoose.model("View", ViewSchema);
  }
}

export default View;
