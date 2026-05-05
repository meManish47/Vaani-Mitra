import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import QuizSession from "@/models/statsModel";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();
    const { score, total, detailed } = body;

    // Auth is optional — guests still get AI feedback, just no DB save
    const userId = getDataFromToken(req);
    const isLoggedIn = !!userId;

    const prompt = `
You are a Hindi speech therapist AI.
Analyze the listening quiz results:

DATA: ${JSON.stringify(detailed)}

Return STRICT JSON only, no \`\`\`, no comments:

{
  "feedback": "short english guidance only",
  "weakPhonemes": ["क","ग","च"],
  "recommendedWords": ["कमल","गणेश"]
}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Clean unwanted markdown wrappers before JSON.parse
    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .replace(/`/g, "")
      .trim();

    let analysis: any = {};

    try {
      analysis = JSON.parse(text);
    } catch (error) {
      console.error("❌ JSON Parse Failed. RAW AI Response:", text);
      return NextResponse.json(
        { error: "Invalid AI JSON returned", raw: text },
        { status: 500 }
      );
    }

    // Ensure fields always exist
    analysis.feedback = analysis.feedback || "Great effort! Keep practicing. 😊";
    analysis.weakPhonemes = analysis.weakPhonemes || [];
    analysis.recommendedWords = analysis.recommendedWords || [];

    // Only save to DB if the user is logged in
    let progressId = null;
    if (isLoggedIn) {
      const session = await QuizSession.create({
        userId,
        quizType: "listening",
        score,
        total,
        words: (detailed || []).map((d: any) => ({
          word: d.word,
          heard: d.selected,
          correct: d.correct,
          phonemes: [],
        })),
        weakPhonemes: analysis.weakPhonemes,
        feedback: analysis.feedback,
      });
      progressId = session._id;
    }

    return NextResponse.json(
      {
        feedback: analysis.feedback,
        weakPhonemes: analysis.weakPhonemes,
        recommendedWords: analysis.recommendedWords,
        progressId,
        saved: isLoggedIn,
        requiresLogin: !isLoggedIn,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("🔥 AI Analysis Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
