import mongoose from "mongoose";

/**
 * QuizSession — one document per completed quiz (listening or speaking).
 * Replaces the old user_progress model that had a schema mismatch.
 */
const quizSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    quizType: {
      type: String,
      enum: ["listening", "speaking"],
      required: true,
    },
    score: { type: Number, required: true },
    total: { type: Number, required: true },

    // Per-word breakdown
    words: [
      {
        word: String,
        heard: String,      // what the user said (speaking) or selected (listening)
        correct: Boolean,
        phonemes: [String], // phonemes present in this word (for adaptive logic)
      },
    ],

    // Weak phonemes identified by AI for this session
    weakPhonemes: [String],

    // AI-generated feedback text
    feedback: String,
  },
  { timestamps: true } // adds createdAt + updatedAt
);

const QuizSession =
  mongoose.models.quiz_sessions ||
  mongoose.model("quiz_sessions", quizSessionSchema);

export default QuizSession;
