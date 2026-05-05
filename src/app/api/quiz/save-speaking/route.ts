import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import QuizSession from "@/models/statsModel";

// Phoneme characters present in each Hindi word (for adaptive recommendations)
const WORD_PHONEME_MAP: Record<string, string[]> = {
  "नमस्ते": ["न", "म", "स", "त"],
  "पानी": ["प", "न"],
  "खाना": ["ख", "न"],
  "माँ": ["म"],
  "घर": ["घ", "र"],
  "किताब": ["क", "त", "ब"],
  "दोस्त": ["द", "स", "त"],
  "स्कूल": ["स", "क", "ल"],
  "सेब": ["स", "ब"],
  "रात": ["र", "त"],
  "कमल": ["क", "म", "ल"],
  "गणेश": ["ग", "ण", "श"],
  "बादल": ["ब", "द", "ल"],
  "फूल": ["फ", "ल"],
  "पत्ता": ["प", "त"],
  "चाँद": ["च", "द"],
  "तारे": ["त", "र"],
  "बादल": ["ब", "द", "ल"],
};

export async function POST(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();
    const { score, total, responses, weakPhonemes = [], feedback = "" } = body;

    // Auth check — optional (guests get requiresLogin: true)
    const userId = getDataFromToken(req);
    const isLoggedIn = !!userId;

    if (!isLoggedIn) {
      return NextResponse.json(
        {
          saved: false,
          requiresLogin: true,
          message: "Login to save your progress!",
        },
        { status: 200 }
      );
    }

    // Build words array with phoneme tagging
    const words = (responses || []).map((r: any) => ({
      word: r.word,
      heard: r.heard || "",
      correct: r.success ?? false,
      phonemes: WORD_PHONEME_MAP[r.word] || [],
    }));

    // Save quiz session
    const session = await QuizSession.create({
      userId,
      quizType: "speaking",
      score,
      total,
      words,
      weakPhonemes,
      feedback,
    });

    return NextResponse.json(
      {
        saved: true,
        requiresLogin: false,
        sessionId: session._id,
        message: "Progress saved! 🎉",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("🔥 save-speaking error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
