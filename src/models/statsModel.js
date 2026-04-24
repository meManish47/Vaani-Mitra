import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

  // Listening or Speaking quiz history
  history: [
    {
      quizType: { type: String, enum: ["listening", "speaking"], required: true },
      word: String,
      correct: Boolean,
      phonemes: [String], // extracted by AI
      timestamp: { type: Date, default: Date.now },
    }
  ],

  // Aggregated stats for personalization
  strengths: {
    type: Map,
    of: Number, // score per phoneme
    default: {},
  },

  weaknesses: {
    type: Map,
    of: Number, // score per phoneme
    default: {},
  },

  lastUpdated: { type: Date, default: Date.now },
});

const UserProgress =
  mongoose.models.user_progress ||
  mongoose.model("user_progress", userProgressSchema);

export default UserProgress;
