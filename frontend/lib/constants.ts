export const EVENT_DATES = {
  registrationOpen: new Date("2026-05-25T00:00:00Z"),
  registrationClose: new Date("2026-06-25T23:59:59Z"),
  submissionDeadline: new Date("2026-06-25T23:59:59Z"),
  resultsOut: new Date("2026-06-28T18:00:00Z"),
  hackathonStart: new Date("2026-07-04T09:00:00Z"),
  hackathonEnd: new Date("2026-07-05T18:00:00Z"),
  winnerAnnouncement: new Date("2026-07-05T20:00:00Z"),
};

export const PRICING = {
  STUDENT: { price: 300, minTeam: 2, maxTeam: 5 },
  IT_PROFESSIONAL: { price: 1000, minTeam: 2, maxTeam: 4 },
  STARTUP: { price: 1000, minTeam: 2, maxTeam: 4 },
};

export const TRACK_CATEGORIES = [
  {
    slug: "track-01",
    category: "Track 01: For Game Developers",
    description: "Nine game genres to build and conquer.",
    tracks: [
      {
        id: "T1-1",
        title: "Action & Adventure — Side-Scroller Combat",
        description: "Build a 2D side-scrolling action game where the player fights waves of enemies across multiple levels. The character moves left and right, attacks enemies, and must survive to reach the end of each stage. Difficulty increases with each level.",
        elements: ["Health bar", "Score counter", "Player sprite", "Enemies from right", "D-pad", "Attack + Jump buttons"],
      },
      {
        id: "T1-2",
        title: "Casual — Bubble Pop Blitz",
        description: "Build a bubble-shooting game where the player clears colored bubbles before they reach the bottom. Match 3 or more same-colored bubbles to pop them. Each level adds more rows and tricky layouts.",
        elements: ["Bubble grid", "Launcher + aim line", "Next bubble preview", "Score + level"],
      },
      {
        id: "T1-3",
        title: "Sports & Racing — Endless Kart Racer",
        description: "Build a top-down kart racing game where the player dodges oncoming traffic and collects speed boosts on an infinite scrolling road. The game gets faster over time and tracks distance covered.",
        elements: ["Vertical scrolling track", "Speedometer", "Distance counter", "Minimap", "Left/Right buttons"],
      },
      {
        id: "T1-4",
        title: "Strategy — Tower Defense",
        description: "Build a tower defense game where the player places different towers along a path to stop waves of enemies from reaching the base. Earn gold by defeating enemies and spend it on new or upgraded towers between waves.",
        elements: ["Grid map with path", "Tower types + cost bar", "Gold counter", "Lives counter", "Enemy HP bars"],
      },
      {
        id: "T1-5",
        title: "Multiplayer / Battle Royale — Last Squad Standing",
        description: "Build a top-down mini battle royale where the player fights AI bots while a shrinking safe zone forces everyone closer together. Collect weapons and survive until the last player standing.",
        elements: ["Top-down map", "Shrinking zone overlay", "HP bar", "Zone timer", "Minimap", "Joystick", "Shoot button"],
      },
      {
        id: "T1-6",
        title: "Horror & Survival — Flashlight Escape",
        description: "Build a top-down survival horror game where the player navigates a dark maze using only a flashlight. Monsters patrol the maze and the player must avoid them while conserving stamina and maintaining sanity to escape.",
        elements: ["Dark maze canvas", "Flashlight reveal", "Stamina bar", "Sanity meter", "Joystick", "Sprint button"],
      },
      {
        id: "T1-7",
        title: "Educational — Math Quest",
        description: "Build an educational game where players answer math questions to attack enemies and progress through levels. Each correct answer deals damage; wrong answers let the enemy strike back. Topics get harder each level.",
        elements: ["Battle scene", "Math question panel", "4 answer buttons", "Timer bar", "Score + level"],
      },
      {
        id: "T1-8",
        title: "Music & Rhythm — Beat Tap Challenge",
        description: "Build a rhythm game where colored notes fall down 4 lanes in sync with the beat. The player must tap the correct lane at the right moment. Combos multiply the score and accuracy ratings are shown after each note.",
        elements: ["4 lane columns", "Falling notes", "Tap zone bar", "Combo multiplier", "Accuracy feedback"],
      },
      {
        id: "T1-9",
        title: "Sandbox & Creative — World Builder",
        description: "Build a grid-based sandbox where players freely place different block types to create their own world. There are no goals — just creative freedom to build landscapes, structures, and environments tile by tile.",
        elements: ["Tile grid canvas", "Block toolbar", "Zoom in/out", "Undo button", "Save button"],
      },
    ]
  },
  {
    slug: "track-02",
    category: "Track 02: Strategy & Growth with AI",
    description: "For MBA Minds, Product Thinkers, and Strategic Builders.",
    tracks: [
      {
        id: "T2-1",
        title: "Strategy & Growth with AI",
        description: "Participants must develop and present an AI-assisted business strategy or growth plan. Build an AI-powered market analysis, a go-to-market strategy, and a revenue model backed by data.",
        elements: ["Strategic Clarity", "AI Integration", "Market Viability", "Revenue Model", "Pitch Quality", "Innovation"],
      }
    ]
  },
  {
    slug: "track-03",
    category: "Track 03: One Idea. One Pitch.",
    description: "Open to Everyone. No Domain Restriction. No Prior Experience Needed.",
    tracks: [
      {
        id: "T3-1",
        title: "One Idea. One Pitch.",
        description: "All you need is one solid idea and the ability to pitch it simply and confidently. Your deck must answer: What is the problem? What is the solution? Who benefits? And why will it work?",
        elements: ["Idea Strength", "AI Relevance", "Pitch Clarity", "Originality", "Delivery", "Impact Potential"],
      }
    ]
  }
];

export const TRACKS = TRACK_CATEGORIES.flatMap(c => c.tracks);

export const TIMELINE = [
  { phase: "Registrations Open", date: "May 25", status: "active" },
  { phase: "Registration Closes & Round 1 Submission", date: "June 25", status: "upcoming" },
  { phase: "Round 1 Results", date: "June 28", status: "upcoming" },
  { phase: "Round 2 Offline", date: "July 4, 5", status: "upcoming" },
  { phase: "Winner Announcement", date: "July 5", status: "upcoming" },
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
    answer: "The final round (Round 2) will be held OFFLINE on July 4th & 5th, 2026.",
  },
  {
    question: "When does the registration close?",
    answer: "Registration closes on June 25th, 2026. This is also the last date for Round 1 online submissions.",
  },
  {
    question: "When is the last date for online submission?",
    answer: "June 25th, 2026. Both registrations and Round 1 online submissions close on June 25th, 2026.",
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
  email: "incuxaigaming@gmail.com",
  instagram: "@incuxai",
};