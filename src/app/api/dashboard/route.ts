// /api/dashboard/route.ts
// Returns real aggregated stats for the logged-in user's dashboard.

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import QuizSession from "@/models/statsModel";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const userId = getDataFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Fetch all sessions for this user ──────────────────────────────
    const allSessions = await QuizSession.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const totalSessions = allSessions.length;
    const totalCorrect = allSessions.reduce((sum, s: any) => sum + (s.score || 0), 0);
    const totalQuestions = allSessions.reduce((sum, s: any) => sum + (s.total || 1), 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    const listeningSessions = allSessions.filter((s: any) => s.quizType === "listening");
    const speakingSessions  = allSessions.filter((s: any) => s.quizType === "speaking");

    const listeningAccuracy = listeningSessions.length > 0
      ? Math.round(
          (listeningSessions.reduce((s: number, q: any) => s + q.score, 0) /
            listeningSessions.reduce((s: number, q: any) => s + q.total, 0)) * 100
        )
      : 0;

    const speakingAccuracy = speakingSessions.length > 0
      ? Math.round(
          (speakingSessions.reduce((s: number, q: any) => s + q.score, 0) /
            speakingSessions.reduce((s: number, q: any) => s + q.total, 0)) * 100
        )
      : 0;

    // ── Day streak ────────────────────────────────────────────────────
    // Group sessions by calendar date (YYYY-MM-DD), then count consecutive days
    const daySet = new Set<string>(
      allSessions.map((s: any) =>
        new Date(s.createdAt).toISOString().split("T")[0]
      )
    );
    const days = Array.from(daySet).sort().reverse(); // newest first

    let streak = 0;
    const today = new Date().toISOString().split("T")[0];
    // Allow today or yesterday to start the streak
    let cursor = new Date(today);
    for (const day of days) {
      const cursorStr = cursor.toISOString().split("T")[0];
      if (day === cursorStr) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    // Stars = 1 per correct answer across all quizzes (capped for gamification)
    const totalStars = Math.min(totalCorrect, 999);

    // Level = 1 star every 10 correct answers
    const level = Math.floor(totalCorrect / 10) + 1;

    // XP = correct answers × 10
    const xp = totalCorrect * 10;

    // ── Recent sessions (last 5) ──────────────────────────────────────
    const recentSessions = allSessions.slice(0, 5).map((s: any) => ({
      id: s._id,
      quizType: s.quizType,
      score: s.score,
      total: s.total,
      accuracy: Math.round((s.score / s.total) * 100),
      date: s.createdAt,
      feedback: s.feedback || "",
    }));

    // ── Weak phonemes — aggregate from QuizSession.weakPhonemes ──────
    // Count how often each phoneme appears in weakPhonemes across all sessions
    const phonemeCount: Record<string, number> = {};
    for (const session of allSessions as any[]) {
      for (const ph of session.weakPhonemes || []) {
        phonemeCount[ph] = (phonemeCount[ph] || 0) + 1;
      }
    }
    const weakPhonemes = Object.entries(phonemeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([phoneme, count]) => ({
        phoneme,
        mistakes: count,
        attempts: count,
        accuracy: 0, // can't compute without per-attempt data; shown as 0
      }));

    // ── Recommended practice words ────────────────────────────────────
    // Words that contain the user's most-missed phonemes
    const WORD_BANK = [
      { word: "नमस्ते", pronunciation: "namaste", hint: "🙏", phonemes: ["न", "म", "स", "त"] },
      { word: "पानी",   pronunciation: "paani",   hint: "💧", phonemes: ["प", "न"]           },
      { word: "खाना",   pronunciation: "khana",   hint: "🍽️", phonemes: ["ख", "न"]           },
      { word: "घर",     pronunciation: "ghar",    hint: "🏠", phonemes: ["घ", "र"]           },
      { word: "किताब",  pronunciation: "kitaab",  hint: "📚", phonemes: ["क", "त", "ब"]      },
      { word: "दोस्त",  pronunciation: "dost",    hint: "🤝", phonemes: ["द", "स", "त"]      },
      { word: "स्कूल",  pronunciation: "iskool",  hint: "🏫", phonemes: ["स", "क", "ल"]      },
      { word: "सेब",    pronunciation: "seb",     hint: "🍎", phonemes: ["स", "ब"]           },
      { word: "रात",    pronunciation: "raat",    hint: "🌙", phonemes: ["र", "त"]           },
      { word: "कमल",    pronunciation: "kamal",   hint: "🌸", phonemes: ["क", "म", "ल"]      },
      { word: "गणेश",   pronunciation: "ganesh",  hint: "🐘", phonemes: ["ग", "ण", "श"]      },
      { word: "बादल",   pronunciation: "baadal",  hint: "☁️", phonemes: ["ब", "द", "ल"]      },
      { word: "फूल",    pronunciation: "phool",   hint: "🌸", phonemes: ["फ", "ल"]           },
      { word: "चाँद",   pronunciation: "chaand",  hint: "🌙", phonemes: ["च", "द"]           },
    ];

    const topWeakPhonemes = weakPhonemes.slice(0, 5).map((p) => p.phoneme);
    let recommended = topWeakPhonemes.length > 0
      ? WORD_BANK.filter((w) => w.phonemes.some((ph) => topWeakPhonemes.includes(ph)))
      : [];
    // If not enough, pad with random
    if (recommended.length < 3) {
      const extras = WORD_BANK.filter((w) => !recommended.includes(w));
      recommended = [...recommended, ...extras].slice(0, 5);
    } else {
      recommended = recommended.slice(0, 5);
    }

    return NextResponse.json(
      {
        totalSessions,
        totalCorrect,
        totalQuestions,
        accuracy,
        listeningAccuracy,
        speakingAccuracy,
        listeningSessions: listeningSessions.length,
        speakingSessions:  speakingSessions.length,
        streak,
        totalStars,
        level,
        xp,
        recentSessions,
        weakPhonemes,
        recommendedWords: recommended,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("🔥 Dashboard error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
