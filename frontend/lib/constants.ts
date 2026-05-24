export const EVENT_DATES = {
  registrationOpen: new Date("2026-05-18T00:00:00Z"),
  registrationClose: new Date("2026-06-16T23:59:59Z"),
  submissionDeadline: new Date("2026-06-16T23:59:59Z"),
  resultsOut: new Date("2026-06-20T00:00:00Z"),
  hackathonStart: new Date("2026-06-27T09:00:00Z"),
  hackathonEnd: new Date("2026-06-28T18:00:00Z"),
  winnerAnnouncement: new Date("2026-06-28T20:00:00Z"),
};

export const PRICING = {
  STUDENT: { price: 300, minTeam: 2, maxTeam: 5 },
  IT_PROFESSIONAL: { price: 1000, minTeam: 2, maxTeam: 4 },
  STARTUP: { price: 1000, minTeam: 2, maxTeam: 4 },
};

export const TRACKS = [
  {
    id: 1,
    title: "AI NPC Systems",
    description: "Build intelligent non-player characters that learn, adapt, and create dynamic gameplay experiences.",
    icon: "Brain",
  },
  {
    id: 2,
    title: "Procedural Content Generation",
    description: "Create algorithms that generate infinite unique game worlds, levels, and assets.",
    icon: "Cube",
  },
  {
    id: 3,
    title: "AI for Game Testing & Balancing",
    description: "Develop AI systems that automatically test games and balance difficulty curves.",
    icon: "TestTube",
  },
  {
    id: 4,
    title: "AR/VR Gaming Experience",
    description: "Push the boundaries of immersive gaming with augmented and virtual reality.",
    icon: "Glasses",
  },
  {
    id: 5,
    title: "Esports Analytics & AI",
    description: "Build tools that analyze gameplay, predict outcomes, and enhance competitive gaming.",
    icon: "Trophy",
  },
  {
    id: 6,
    title: "Serious Games for Social Impact",
    description: "Create games that educate, raise awareness, and drive positive social change.",
    icon: "Heart",
  },
  {
    id: 7,
    title: "Metaverse and Web3 Gaming",
    description: "Build decentralized gaming experiences with blockchain integration and digital ownership.",
    icon: "Globe",
  },
];

export const TIMELINE = [
  { phase: "Registrations Open", date: "May 18", status: "active" },
  { phase: "Online Submission Deadline", date: "June 16", status: "upcoming" },
  { phase: "Results Announced", date: "June 20", status: "upcoming" },
  { phase: "Final Round (Offline)", date: "June 27-28", status: "upcoming" },
  { phase: "Winner Announcement", date: "June 28", status: "upcoming" },
];

export const PRIZE_POOL = [
  { place: "Grand Prize", prize: "10,00,000", color: "from-yellow-400 to-yellow-600" },
  { place: "Creative Ideas", prize: "Opportunity", color: "from-primary to-neon-blue" },
  { place: "Internships", prize: "Career Growth", color: "from-secondary to-neon-purple" },
  { place: "Incubation", prize: "Startup Support", color: "from-green-400 to-green-600" },
  { place: "Investments", prize: "Funding", color: "from-orange-400 to-orange-600" },
];

export const FAQS = [
  {
    question: "What is the team size?",
    answer: "Students: 2-5 members | Startups & Professionals: 2-4 members",
  },
  {
    question: "Is there a registration fee?",
    answer: "Students: ₹300/person | Startups & Working Professionals: ₹1000/person",
  },
  {
    question: "Is the event online or offline?",
    answer: "The final round will be held OFFLINE on June 27th & 28th, 2026.",
  },
  {
    question: "When is the last date for online submission?",
    answer: "June 16th, 2026. Results will be announced on June 20th.",
  },
  {
    question: "Who is eligible to participate?",
    answer: "All B.Tech, M.Tech students, Startups & Working Professionals can participate.",
  },
  {
    question: "What are the cash prizes?",
    answer: "Cash prizes worth ₹10 Lakhs along with opportunities for internships, incubation & investments.",
  },
];

export const CONTACT_INFO = {
  website: "https://incuxai.com",
  phone: "+91 7995061289",
  email: "incuxgaming@gmail.com",
  instagram: "@incuxai",
};