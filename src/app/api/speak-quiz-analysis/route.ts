// /app/api/speak-quiz-analysis/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  let data: any = {};
  try {
    data = await req.json();

    const prompt = `
तुम एक दोस्ताना हिंदी उच्चारण कोच हो जो 6-12 साल के बच्चों को पढ़ाता है।

बच्चे को यह शब्द बोलना था: "${data.word}" (उच्चारण: ${data.pronunciation})
बच्चे ने बोला: "${data.heard}"
क्या सही था: ${data.success ? "हाँ" : "नहीं"}

तुम्हें ONLY हिंदी में जवाब देना है। एक भी अंग्रेज़ी शब्द नहीं।

जवाब बिल्कुल इस format में दो — हर point नई line पर:

👂 बच्चे ने क्या बोला और सही उच्चारण क्या है — एक line में सीधे बताओ
🔤 शब्द को syllables में तोड़ो और बताओ कैसे बोलते हैं (जैसे: ना-मस-ते)
💡 एक खास tip जो उच्चारण सुधारे
🌟 एक छोटी हिम्मत देने वाली बात

नियम:
- हर point सिर्फ 1-2 lines का हो, ज़्यादा नहीं
- बिल्कुल आसान हिंदी जो बच्चा समझ सके
- कोई technical शब्द नहीं
- अगर बच्चा सही था तो सिर्फ तारीफ करो, बाकी points छोड़ो
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ feedback: text }, { status: 200 });
  } catch (err: any) {
    const errMsg = err?.message || err?.toString() || "unknown error";
    console.error("speak-quiz-analysis error:", errMsg);
    return NextResponse.json({ feedback: "DEBUG: " + errMsg }, { status: 200 });
  }
}
