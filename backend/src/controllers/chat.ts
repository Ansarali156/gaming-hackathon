import { Request, Response } from 'express';

const FAQ_RESPONSES: Record<string, string> = {
  'fees': 'Registration fees: ₹300/person for students, ₹1000/person for IT professionals, ₹5000/company for startups.',
  'team size': 'Teams can have 2-5 members for students, 2-3 for IT professionals, and 2 members for startups.',
  'refund': 'Refunds are available up to 7 days before the event start date. Contact support for assistance.',
  'eligibility': 'Students, IT professionals, and startups from across India are welcome to participate.',
  'certificate': 'Yes, all participants receive digital certificates. Winners get special recognition certificates.',
  'schedule': 'Registrations open May 18, Hackathon begins June 12, Final submission June 20, Winners announced June 28.',
  'venue': 'The hackathon will be held in a hybrid format with both online and offline participation.',
  'discord': 'Join our Discord server for updates, mentorship, and team collaboration. Link is on our homepage.',
  'prize': '1st Place: ₹1,00,000 | 2nd Place: ₹50,000 | 3rd Place: ₹25,000 | Best AI Innovation: ₹15,000',
  'theme': 'Tracks include AI NPC Systems, Procedural Content Generation, AI Game Testing, AR/VR Gaming, Esports Analytics, Serious Games, and Metaverse/Web3 Gaming.',
  'payment': 'We accept UPI, Credit/Debit Cards, Net Banking, and Wallets through Razorpay.',
  'contact': 'You can reach us at hello@incuxai.com or through our Discord server.',
};

export const chatController = {
  async handleMessage(req: Request, res: Response) {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const lowerMessage = message.toLowerCase();
      let response = "I'm here to help! You can ask about fees, team size, refunds, eligibility, certificates, schedule, venue, Discord, prizes, themes, payment, or contact info.";

      for (const [key, answer] of Object.entries(FAQ_RESPONSES)) {
        if (lowerMessage.includes(key)) {
          response = answer;
          break;
        }
      }

      res.json({ success: true, response });
    } catch (error) {
      res.status(500).json({ error: 'Failed to process message' });
    }
  },
};