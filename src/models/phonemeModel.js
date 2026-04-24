import mongoose from "mongoose";

const phonemeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    phoneme: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    mistakes: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

export default mongoose.models.phoneme_stats ||
  mongoose.model("phoneme_stats", phonemeSchema);
