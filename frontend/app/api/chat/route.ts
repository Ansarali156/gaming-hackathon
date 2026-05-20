import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || ""
});

const SYSTEM_PROMPT = `You are a helpful assistant for IncuXai AI Gaming Hackathon. Answer questions about:
- Registration: Fees (₹300/person students, ₹1000/person IT professionals, ₹5000/company startups), team size (2-5 students, 2-3 IT, 2 startups), refund policy
- Event: Schedule (May 18 - June 28, 2026), rules, venue (hybrid online/offline)
- Technical: Submission format (PPT, demo video, GitHub link, APK), allowed tools, judging criteria
- Tracks: AI NPC Systems, Procedural Content Generation, AI for Game Testing, AR/VR Gaming, Esports Analytics, Serious Games, Metaverse/Web3

Be concise and friendly. If someone asks about joining the community, prompt them to join Discord.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nAssistant:`,
    });

    const text = response.text || "I am unable to generate a response at the moment.";

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ response: "I'm having trouble connecting. Please try again later or email us at hello@incuxai.com" });
  }
}

