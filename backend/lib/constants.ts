export const EVENT_DATES = {
  registrationOpen: new Date("2026-05-25T00:00:00Z"),
  registrationClose: new Date("2026-06-25T23:59:59Z"),
  round1: new Date("2026-06-25T23:59:59Z"),
  round2: new Date("2026-07-04T09:00:00Z"),
  hackathonStart: new Date("2026-07-04T09:00:00Z"),
  submissionDeadline: new Date("2026-07-05T18:00:00Z"),
  winnerAnnouncement: new Date("2026-07-05T20:00:00Z"),
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
  { phase: "Registrations Open", date: "May 25", status: "active" },
  { phase: "Registration Closes", date: "June 25", status: "upcoming" },
  { phase: "Round 1 Submission", date: "June 25", status: "upcoming" },
  { phase: "Round 1 Results", date: "June 28", status: "upcoming" },
  { phase: "Round 2 Offline", date: "July 4, 5", status: "upcoming" },
  { phase: "Winner Announcement", date: "July 5", status: "upcoming" },
];

export const PRIZE_POOL = [
  { place: "1st Place", prize: "₹1,00,000", color: "from-yellow-400 to-yellow-600" },
  { place: "2nd Place", prize: "₹50,000", color: "from-gray-300 to-gray-500" },
  { place: "3rd Place", prize: "₹25,000", color: "from-orange-400 to-orange-600" },
  { place: "Best AI Innovation", prize: "₹15,000", color: "from-primary to-neon-blue" },
  { place: "Best Game Design", prize: "₹15,000", color: "from-secondary to-neon-purple" },
];

export const FAQS = [
  {
    question: "What is the team size?",
    answer: "Teams can have 2-5 members for students and 2-4 members for IT professionals and startups.",
  },
  {
    question: "Is there a registration fee?",
    answer: "Yes: ₹300/person for students, ₹1000/person for IT professionals, and ₹1000/person for startups.",
  },
  {
    question: "Is the event online or offline?",
    answer: "The hackathon will be held in a hybrid format with both online and offline participation options.",
  },
  {
    question: "Are refunds available?",
    answer: "Refunds are available up to 7 days before the event start date. Please contact support for assistance.",
  },
  {
    question: "Who is eligible to participate?",
    answer: "Students, IT professionals, and startups from across India are welcome to participate.",
  },
  {
    question: "Will certificates be provided?",
    answer: "Yes, all participants will receive digital certificates. Winners will receive special recognition certificates.",
  },
];
