import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || ""
});

const SYSTEM_PROMPT = `You are a helpful virtual assistant for the AI Gaming Hackathon. Answer questions accurately and concisely about:
- Registration fees: Students ₹300/person, IT Professionals ₹1000/person, Startups ₹1000/person.
- Team size: Students 2-5 members, IT Professionals 2-4 members, Startups 2-4 members.
- Timeline: Registrations open May 18, Hackathon begins June 12, Round 1 is June 12-20 with Final Submission on June 20, Round 2 (offline) is June 27-28, Winner Announcement is June 28.
- Tracks: AI NPC Systems, Procedural Content Generation, AI Game Testing, AR/VR Immersive Gaming, Esports Analytics, Serious Games, Metaverse/Web3.
- Refund Policy: Completely non-refundable due to immediate resource commitments.
- Venue: Hybrid (online initial submissions for Round 1, 24h offline Grand Finale in Anantapur, AP).
- Support: incuxgaming@gmail.com or +91 7995061289.

Be concise, warm, and encourage users to register or join our Discord.`;

const FAQ_RESPONSES: Record<string, string> = {
  "fee": "Registration fees are dynamically calculated by category:\n• Students: ₹300 per person\n• IT Professionals: ₹1000 per person\n• Startups: ₹1000 per person\n\nAll payments are processed securely via Razorpay.",
  "price": "Registration fees are dynamically calculated by category:\n• Students: ₹300 per person\n• IT Professionals: ₹1000 per person\n• Startups: ₹1000 per person\n\nAll payments are processed securely via Razorpay.",
  "cost": "Registration fees are dynamically calculated by category:\n• Students: ₹300 per person\n• IT Professionals: ₹1000 per person\n• Startups: ₹1000 per person\n\nAll payments are processed securely via Razorpay.",
  "team": "Team size requirements vary by category:\n• Students: 2 to 5 members per team\n• IT Professionals: 2 to 4 members per team\n• Startups: 2 to 4 members per team\n\nNote: All members will have dashboard accounts.",
  "size": "Team size requirements vary by category:\n• Students: 2 to 5 members per team\n• IT Professionals: 2 to 4 members per team\n• Startups: 2 to 4 members per team\n\nNote: All members will have dashboard accounts.",
  "refund": "Due to immediate resource deployments (infrastructure cloud credits, grand finale vouchers, server allocations), registration fees are strictly non-refundable once paid.",
  "schedule": "Timeline for the 2026 Hackathon:\n• May 18: Registrations Open (Active)\n• June 12: Hackathon Begins\n• June 12–20: Round 1\n• June 20: Final Submission\n• June 27, 28: Round 2 (Offline Grand Finale)\n• June 28: Winner Announcement",
  "date": "Timeline for the 2026 Hackathon:\n• May 18: Registrations Open (Active)\n• June 12: Hackathon Begins\n• June 12–20: Round 1\n• June 20: Final Submission\n• June 27, 28: Round 2 (Offline Grand Finale)\n• June 28: Winner Announcement",
  "when": "Timeline for the 2026 Hackathon:\n• May 18: Registrations Open (Active)\n• June 12: Hackathon Begins\n• June 12–20: Round 1\n• June 20: Final Submission\n• June 27, 28: Round 2 (Offline Grand Finale)\n• June 28: Winner Announcement",
  "venue": "Round 1 is fully online (June 12-20) with Final Submission on June 20. The grand finale (Round 2) is a 24-hour offline hackathon held on June 27-28, 2026 in Anantapur, Andhra Pradesh, India.",
  "location": "Round 1 is fully online (June 12-20) with Final Submission on June 20. The grand finale (Round 2) is a 24-hour offline hackathon held on June 27-28, 2026 in Anantapur, Andhra Pradesh, India.",
  "where": "Round 1 is fully online (June 12-20) with Final Submission on June 20. The grand finale (Round 2) is a 24-hour offline hackathon held on June 27-28, 2026 in Anantapur, Andhra Pradesh, India.",
  "prize": "Prizes worth over ₹10 Lakhs are up for grabs, including cash awards, corporate internships, seed incubation support, and direct investor pitch opportunities for startups!",
  "reward": "Prizes worth over ₹10 Lakhs are up for grabs, including cash awards, corporate internships, seed incubation support, and direct investor pitch opportunities for startups!",
  "track": "We have 7 cutting-edge challenge tracks:\n1. AI NPC Systems\n2. Procedural Content Generation\n3. AI for Game Testing & Balancing\n4. AR/VR Immersive Gaming\n5. Esports Analytics & AI\n6. Serious Games for Social Impact\n7. Metaverse & Web3 Gaming",
  "theme": "We have 7 cutting-edge challenge tracks:\n1. AI NPC Systems\n2. Procedural Content Generation\n3. AI for Game Testing & Balancing\n4. AR/VR Immersive Gaming\n5. Esports Analytics & AI\n6. Serious Games for Social Impact\n7. Metaverse & Web3 Gaming",
  "discord": "Join our official Discord community to connect with other developers, form teams, and get direct mentorship: https://discord.gg/8gaK52vEs",
  "contact": "You can contact our Brand Relations Committee at incuxgaming@gmail.com or call us directly at +91 7995061289.",
  "support": "You can contact our Brand Relations Committee at incuxgaming@gmail.com or call us directly at +91 7995061289.",
  "email": "You can contact our Brand Relations Committee at incuxgaming@gmail.com or call us directly at +91 7995061289.",
  "phone": "You can contact our Brand Relations Committee at incuxgaming@gmail.com or call us directly at +91 7995061289.",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || "";
    if (apiKey) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nAssistant:`,
        });

        if (response.text) {
          return NextResponse.json({ response: response.text });
        }
      } catch (geminiError) {
        console.error("Gemini API call failed, falling back to local matcher:", geminiError);
      }
    }

    // Keyword matching fallback
    const lowerMessage = message.toLowerCase();
    let matchedResponse = "I'm your virtual assistant! You can ask me about registration fees, team size, refund policies, hackathon dates, venue, prize pool, challenge tracks, or direct contact details.";

    for (const [key, answer] of Object.entries(FAQ_RESPONSES)) {
      if (lowerMessage.includes(key)) {
        matchedResponse = answer;
        break;
      }
    }

    return NextResponse.json({ response: matchedResponse });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ response: "I'm having trouble connecting right now. Please email support at incuxgaming@gmail.com or call +91 7995061289." });
  }
}
