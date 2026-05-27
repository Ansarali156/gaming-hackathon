export const EVENT_DATES = {
  registrationOpen: new Date("2026-05-18T00:00:00Z"),
  registrationClose: new Date("2026-06-16T00:00:00Z"),
  submissionDeadline: new Date("2026-06-20T23:59:59Z"),
  resultsOut: new Date("2026-06-20T23:59:59Z"),
  hackathonStart: new Date("2026-06-12T09:00:00Z"),
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
    title: "Action & Adventure — Side-Scroller Combat",
    description: "Build a 2D side-scrolling action game where the player fights waves of enemies across multiple levels. The character moves left and right, attacks enemies, and must survive to reach the end of each stage. Difficulty increases with each level.",
    elements: ["Health bar — top left", "Enemies from right — canvas", "Score counter — top right", "Player sprite — center left", "D-pad — bottom left", "Attack + Jump buttons — bottom right"],
  },
  {
    id: 2,
    title: "Casual — Bubble Pop Blitz",
    description: "Build a bubble-shooting game where the player clears colored bubbles before they reach the bottom. Match 3 or more same-colored bubbles to pop them. Each level adds more rows and tricky layouts.",
    elements: ["Bubble grid — top area", "Score + level — top bar", "Launcher + aim line — bottom center", "Next bubble preview — bottom right", "Tap/drag to aim & shoot — mechanic"],
  },
  {
    id: 3,
    title: "Sports & Racing — Endless Kart Racer",
    description: "Build a top-down kart racing game where the player dodges oncoming traffic and collects speed boosts on an infinite scrolling road. The game gets faster over time and tracks distance covered.",
    elements: ["Vertical scrolling track — center", "Minimap — top right", "Speedometer — bottom right", "Distance counter — top center", "Left/Right buttons — bottom corners"],
  },
  {
    id: 4,
    title: "Strategy — Tower Defense",
    description: "Build a tower defense game where the player places different towers along a path to stop waves of enemies from reaching the base. Earn gold by defeating enemies and spend it on new or upgraded towers between waves.",
    elements: ["Grid map with enemy path — center", "Lives counter — top left", "Enemy HP bars — above units", "Tower types + cost — bottom bar", "Start wave button — top right", "Gold counter — top left", "Tower range on hover — canvas"],
  },
  {
    id: 5,
    title: "Multiplayer / Battle Royale — Last Squad Standing",
    description: "Build a top-down mini battle royale where the player fights AI bots while a shrinking safe zone forces everyone closer together. Collect weapons and survive until the last player standing.",
    elements: ["Top-down map canvas — center", "Zone timer — top center", "Shoot button — bottom right", "Shrinking zone overlay — canvas", "Minimap — top right", "HP bar — bottom left", "Joystick — bottom left"],
  },
  {
    id: 6,
    title: "Horror & Survival — Flashlight Escape",
    description: "Build a top-down survival horror game where the player navigates a dark maze using only a flashlight. Monsters patrol the maze and the player must avoid them while conserving stamina and maintaining sanity to escape.",
    elements: ["Dark maze canvas — full screen", "Sanity meter — top right", "Flashlight reveal — around player", "Stamina bar — top left", "Joystick — bottom left", "Sprint button — bottom right"],
  },
  {
    id: 7,
    title: "Educational — Math Quest",
    description: "Build an educational game where players answer math questions to attack enemies and progress through levels. Each correct answer deals damage; wrong answers let the enemy strike back. Topics get harder each level.",
    elements: ["Battle scene — top half", "Timer bar — per question", "Math question — bottom half", "4 answer buttons — bottom grid", "Correct/wrong feedback — battle scene", "Score + level — top bar"],
  },
  {
    id: 8,
    title: "Music & Rhythm — Beat Tap Challenge",
    description: "Build a rhythm game where colored notes fall down 4 lanes in sync with the beat. The player must tap the correct lane at the right moment. Combos multiply the score and accuracy ratings are shown after each note.",
    elements: ["4 lane columns — full canvas", "Combo multiplier — top center", "Falling notes — top to bottom", "Accuracy feedback — center screen", "Tap zone bar — near bottom", "Lane tap buttons — bottom"],
  },
  {
    id: 9,
    title: "Sandbox & Creative — World Builder",
    description: "Build a grid-based sandbox where players freely place different block types to create their own world. There are no goals — just creative freedom to build landscapes, structures, and environments tile by tile.",
    elements: ["Tile grid canvas — center", "Undo button — top left", "Block type toolbar — bottom", "Save button — top right", "Zoom in/out — top right", "Tap tile to place block — mechanic"],
  },
];

export const TIMELINE = [
  { phase: "Registrations Open", date: "May 18", status: "active" },
  { phase: "Hackathon Begins", date: "June 12", status: "upcoming" },
  { phase: "Round 1", date: "June 12–20", status: "upcoming" },
  { phase: "Final Submission", date: "June 20", status: "upcoming" },
  { phase: "Round 2", date: "June 27, 28", status: "upcoming" },
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
    answer: "The final round (Round 2) will be held OFFLINE on June 27th & 28th, 2026.",
  },
  {
    question: "When is the last date for online submission?",
    answer: "June 20th, 2026. Round 1 submission deadline is June 20th.",
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