import mongoose from "mongoose";

let Invitation;

try {
  if (mongoose.model("Invitation")) {
    Invitation = mongoose.model("Invitation");
  }
} catch (e) {
  if (e.name === "MissingSchemaError") {
    const InvitationSchema = new mongoose.Schema(
      {
        key: {
          type: String,
          required: true,
        },
        clipId: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["accepted", "pending"],
          default: "pending",
        },
        creatorId: {
          type: String,
          required: true,
        },
        expiresAt: {
          type: Date,
        },
      },
      { timestamps: true }
    );

    Invitation = mongoose.model("Invitation", InvitationSchema);
  }
}

export default Invitation;
