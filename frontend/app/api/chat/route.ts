import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || ""
});

const SYSTEM_PROMPT = `You are a helpful virtual assistant for the AI Gaming Hackathon. Answer questions accurately and concisely about:
- Registration fees: Students ₹300/person, IT Professionals ₹1000/person, Startups ₹1000/person.
- Team size: Students 2-5 members, IT Professionals 2-4 members, Startups 2-4 members.
- Timeline: Registrations open May 25, Registration Closes June 25, Round 1 Submission is June 25, Round 1 Results on June 28, Round 2 (offline Grand Finale) is July 4-5, Winner Announcement is July 5.
- Tracks: AI NPC Systems, Procedural Content Generation, AI Game Testing, AR/VR Immersive Gaming, Esports Analytics, Serious Games, Metaverse/Web3.
- Refund Policy: Completely non-refundable due to immediate resource commitments.
- Venue: Hybrid (online initial submissions for Round 1, 24h offline Grand Finale in Anantapur, AP).
- Support: incuxaigaming@gmail.com or +91 7995061289.

Be concise, warm, and encourage users to register or reach out via WhatsApp at +91 7995061289.`;

const FAQ_RESPONSES: Record<string, string> = {
  "fee": "Registration fees are dynamically calculated by category:\n• Students: ₹300 per person\n• IT Professionals: ₹1000 per person\n• Startups: ₹1000 per person\n\nAll payments are processed securely via Razorpay.",
  "price": "Registration fees are dynamically calculated by category:\n• Students: ₹300 per person\n• IT Professionals: ₹1000 per person\n• Startups: ₹1000 per person\n\nAll payments are processed securely via Razorpay.",
  "cost": "Registration fees are dynamically calculated by category:\n• Students: ₹300 per person\n• IT Professionals: ₹1000 per person\n• Startups: ₹1000 per person\n\nAll payments are processed securely via Razorpay.",
  "team": "Team size requirements vary by category:\n• Students: 2 to 5 members per team\n• IT Professionals: 2 to 4 members per team\n• Startups: 2 to 4 members per team\n\nNote: All members will have dashboard accounts.",
  "size": "Team size requirements vary by category:\n• Students: 2 to 5 members per team\n• IT Professionals: 2 to 4 members per team\n• Startups: 2 to 4 members per team\n\nNote: All members will have dashboard accounts.",
  "refund": "Due to immediate resource deployments (infrastructure cloud credits, grand finale vouchers, server allocations), registration fees are strictly non-refundable once paid.",
  "schedule": "Timeline for the 2026 Hackathon:\n• May 25: Registrations Open (Active)\n• June 25: Registration Closes / Round 1 Submission Deadline\n• June 28: Round 1 Evaluation & Results\n• July 4–5: Round 2 (Offline Grand Finale in Anantapur)\n• July 5: Winner Announcement",
  "date": "Timeline for the 2026 Hackathon:\n• May 25: Registrations Open (Active)\n• June 25: Registration Closes / Round 1 Submission Deadline\n• June 28: Round 1 Evaluation & Results\n• July 4–5: Round 2 (Offline Grand Finale in Anantapur)\n• July 5: Winner Announcement",
  "when": "Timeline for the 2026 Hackathon:\n• May 25: Registrations Open (Active)\n• June 25: Registration Closes / Round 1 Submission Deadline\n• June 28: Round 1 Evaluation & Results\n• July 4–5: Round 2 (Offline Grand Finale in Anantapur)\n• July 5: Winner Announcement",
  "venue": "Round 1 is fully online with registration and project submissions closing on June 25, 2026. The grand finale (Round 2) is a 24-hour offline hackathon held on July 4-5, 2026 in Anantapur, Andhra Pradesh, India.",
  "location": "Round 1 is fully online with registration and project submissions closing on June 25, 2026. The grand finale (Round 2) is a 24-hour offline hackathon held on July 4-5, 2026 in Anantapur, Andhra Pradesh, India.",
  "where": "Round 1 is fully online with registration and project submissions closing on June 25, 2026. The grand finale (Round 2) is a 24-hour offline hackathon held on July 4-5, 2026 in Anantapur, Andhra Pradesh, India.",
  "prize": "Prizes worth over ₹10 Lakhs are up for grabs, including cash awards, corporate internships, seed incubation support, and direct investor pitch opportunities for startups!",
  "reward": "Prizes worth over ₹10 Lakhs are up for grabs, including cash awards, corporate internships, seed incubation support, and direct investor pitch opportunities for startups!",
  "track": "We have 3 main challenge tracks:\nTrack 1: For Game Developers (9 sub-tracks including Action, Strategy, Multiplayer, etc.)\nTrack 2: Strategy & Growth with AI (For MBA/Product folks)\nTrack 3: One Idea. One Pitch. (Open to everyone with a solid idea)",
  "theme": "We have 3 main challenge tracks:\nTrack 1: For Game Developers (9 sub-tracks including Action, Strategy, Multiplayer, etc.)\nTrack 2: Strategy & Growth with AI (For MBA/Product folks)\nTrack 3: One Idea. One Pitch. (Open to everyone with a solid idea)",
  "discord": "We have transitioned our community support to WhatsApp! You can reach us directly on WhatsApp for support, team formation help, and quick queries at +91 7995061289 or chat directly at: https://wa.me/917995061289",
  "whatsapp": "Reach out to us directly on WhatsApp for support, team formation help, and quick queries at +91 7995061289 or chat directly at: https://wa.me/917995061289",
  "contact": "You can contact our Brand Relations Committee at incuxaigaming@gmail.com or call/WhatsApp us directly at +91 7995061289.",
  "support": "You can contact our Brand Relations Committee at incuxaigaming@gmail.com or call/WhatsApp us directly at +91 7995061289.",
  "email": "You can contact our Brand Relations Committee at incuxaigaming@gmail.com or call/WhatsApp us directly at +91 7995061289.",
  "phone": "You can contact our Brand Relations Committee at incuxaigaming@gmail.com or call/WhatsApp us directly at +91 7995061289.",
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
    return NextResponse.json({ response: "I'm having trouble connecting right now. Please email support at incuxaigaming@gmail.com or call +91 7995061289." });
  }
}
