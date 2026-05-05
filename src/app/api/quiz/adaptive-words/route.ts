// /api/quiz/adaptive-words/route.ts
// Returns 5 quiz words personalised to the user's most-missed phonemes.
// Falls back to random words for guests or users with no history.

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import QuizSession from "@/models/statsModel";

const WORD_BANK = [
  { word: "नमस्ते", hint: "🙏", pronunciation: "namaste", phonemes: ["न", "म", "स", "त"] },
  { word: "पानी",   hint: "💧", pronunciation: "paani",   phonemes: ["प", "न"]           },
  { word: "खाना",   hint: "🍽️", pronunciation: "khana",   phonemes: ["ख", "न"]           },
  { word: "माँ",    hint: "👩", pronunciation: "maa",     phonemes: ["म"]                },
  { word: "घर",     hint: "🏠", pronunciation: "ghar",    phonemes: ["घ", "र"]           },
  { word: "किताब",  hint: "📚", pronunciation: "kitaab",  phonemes: ["क", "त", "ब"]      },
  { word: "दोस्त",  hint: "🤝", pronunciation: "dost",    phonemes: ["द", "स", "त"]      },
  { word: "स्कूल",  hint: "🏫", pronunciation: "iskool",  phonemes: ["स", "क", "ल"]      },
  { word: "सेब",    hint: "🍎", pronunciation: "seb",     phonemes: ["स", "ब"]           },
  { word: "रात",    hint: "🌙", pronunciation: "raat",    phonemes: ["र", "त"]           },
  { word: "कमल",    hint: "🌸", pronunciation: "kamal",   phonemes: ["क", "म", "ल"]      },
  { word: "गणेश",   hint: "🐘", pronunciation: "ganesh",  phonemes: ["ग", "ण", "श"]      },
  { word: "बादल",   hint: "☁️", pronunciation: "baadal",  phonemes: ["ब", "द", "ल"]      },
  { word: "फूल",    hint: "🌺", pronunciation: "phool",   phonemes: ["फ", "ल"]           },
  { word: "चाँद",   hint: "🌙", pronunciation: "chaand",  phonemes: ["च", "द"]           },
  { word: "तारा",   hint: "⭐", pronunciation: "taara",   phonemes: ["त", "र"]           },
  { word: "पेड़",   hint: "🌳", pronunciation: "ped",     phonemes: ["प", "ड"]           },
  { word: "नदी",    hint: "🏞️", pronunciation: "nadi",    phonemes: ["न", "द"]           },
  { word: "बिल्ली", hint: "🐱", pronunciation: "billi",   phonemes: ["ब", "ल"]           },
  { word: "कुत्ता", hint: "🐶", pronunciation: "kutta",   phonemes: ["क", "त"]           },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export async function GET(req: NextRequest) {
  try {
    await connect();
    const userId = getDataFromToken(req);

    // No history / guest → return random 5
    if (!userId) {
      return NextResponse.json(
        { words: shuffle(WORD_BANK).slice(0, 5), adaptive: false },
        { status: 200 }
      );
    }

    // Get top phoneme mistakes from QuizSession.weakPhonemes
    const sessions = await QuizSession.find({ userId })
      .select("weakPhonemes")
      .lean();

    // Count phoneme occurrences across all sessions
    const phonemeCount: Record<string, number> = {};
    for (const s of sessions as any[]) {
      for (const ph of s.weakPhonemes || []) {
        phonemeCount[ph] = (phonemeCount[ph] || 0) + 1;
      }
    }

    if (!Object.keys(phonemeCount).length) {
      // No history yet — random words
      return NextResponse.json(
        { words: shuffle(WORD_BANK).slice(0, 5), adaptive: false },
        { status: 200 }
      );
    }

    const weakPhonemes = Object.entries(phonemeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([ph]) => ph);

    // Score each word by how many weak phonemes it contains
    const scored = WORD_BANK.map((w) => ({
      ...w,
      score: w.phonemes.filter((ph) => weakPhonemes.includes(ph)).length,
    })).sort((a, b) => b.score - a.score);

    // Take top 3 adaptive + 2 random for variety
    const adaptive = scored.filter((w) => w.score > 0).slice(0, 3);
    const rest     = shuffle(scored.filter((w) => w.score === 0));
    const selected = [...adaptive, ...rest].slice(0, 5);

    // Pad if not enough
    const final = selected.length >= 5
      ? selected
      : [...selected, ...shuffle(WORD_BANK).filter((w) => !selected.find((s) => s.word === w.word)).map((w) => ({ ...w, score: 0 }))].slice(0, 5);

    return NextResponse.json(
      {
        words: final,
        adaptive: adaptive.length > 0,
        weakPhonemes,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("🔥 adaptive-words error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
