# 🎮 IncuXAI — India's Ultimate AI Gaming Hackathon Platform

> **Build. Battle. Innovate & Conquer.**

A full-stack AI Gaming Hackathon platform with separate frontend and backend, featuring payment integration, Discord verification, admin dashboard, and community tools.

---

## 📁 Project Structure

```
incuxai-platform/
├── frontend/                 # Next.js 15 Frontend (Port 3000)
│   ├── app/                  # Pages & layouts (App Router)
│   │   ├── (auth)/           # Login & register pages
│   │   ├── api/              # NextAuth API routes
│   │   ├── dashboard/        # Participant & admin dashboards
│   │   ├── register/         # Multi-step registration
│   │   ├── sponsors/         # Sponsor landing page
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Homepage
│   ├── components/           # React components
│   │   ├── layout/           # Header, Footer, FloatingActions
│   │   ├── sections/         # Hero, About, Tracks, Prizes, etc.
│   │   └── ui/               # ChatBot, ParticleBackground
│   ├── styles/               # Additional styles
│   ├── types/                # TypeScript type definitions
│   ├── .env                  # Frontend environment variables
│   ├── next.config.js        # Next.js configuration
│   ├── package.json          # Frontend dependencies
│   └── tsconfig.json         # TypeScript configuration
│
├── backend/                  # Express.js Backend (Port 4000)
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   │   ├── auth.ts       # Login, register, session
│   │   │   ├── admin.ts      # Analytics, approvals, announcements
│   │   │   ├── chat.ts       # AI chatbot responses
│   │   │   ├── discord.ts    # Discord OAuth & verification
│   │   │   ├── email.ts      # Email automation (Resend)
│   │   │   ├── payments.ts   # Razorpay verification & webhooks
│   │   │   ├── register.ts   # Team registration
│   │   │   └── teams.ts      # Team management & submissions
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic services
│   │   ├── middleware/       # Auth, validation, error handling
│   │   └── index.ts          # Express server entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client singleton
│   │   └── razorpay.ts       # Razorpay order creation & verification
│   ├── utils/
│   │   └── index.ts          # Helper functions (teamId, formatting)
│   ├── .env                  # Backend environment variables
│   ├── package.json          # Backend dependencies
│   └── tsconfig.json         # TypeScript configuration
│
└── package.json              # Root package (runs both servers)
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### 1. Clone & Install

```bash
# Install all dependencies (root, frontend, backend)
npm run install:all
```

### 2. Setup Environment Variables

**Frontend** (`frontend/.env`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/incuxai_hackathon?schema=public"
BACKEND_PORT=4000
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:4000
JWT_SECRET=your-jwt-secret
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM="noreply@incuxai.com"
DISCORD_BOT_TOKEN=your-discord-bot-token
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DISCORD_GUILD_ID=your-discord-guild-id
OPENAI_API_KEY=your-openai-api-key
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio
npm run db:studio
```

### 4. Run Development Servers

```bash
# Start both frontend and backend concurrently
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.4 | React framework with App Router |
| React | 19 | UI library |
| TypeScript | 5.8 | Type safety |
| Tailwind CSS | 4.1 | Utility-first styling |
| Framer Motion | 12.23 | Animations |
| NextAuth | 4.24 | Authentication |
| Lucide React | 0.546 | Icon library |
| QRCode | 1.5 | Ticket generation |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Express.js | 4.19 | Node.js web framework |
| TypeScript | 5.8 | Type safety |
| Prisma | 6.5 | ORM for PostgreSQL |
| PostgreSQL | 15+ | Database |
| Razorpay | 2.9 | Payment gateway |
| Resend | 4.1 | Email service |
| bcryptjs | 3.0 | Password hashing |
| jsonwebtoken | 9.0 | JWT authentication |
| Zod | 3.24 | Schema validation |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/verify-otp` | Verify OTP |
| GET | `/api/auth/session` | Get current session |

### Registration
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Create team registration |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/verify` | Verify Razorpay payment |
| POST | `/api/payments/webhook` | Handle Razorpay webhooks |

### Teams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams/:teamId` | Get team details |
| PUT | `/api/teams/:teamId` | Update team info |
| POST | `/api/teams/:teamId/submit` | Submit project |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/analytics` | Get analytics data |
| GET | `/api/admin/participants` | List all participants |
| PUT | `/api/admin/participants/:teamId/approve` | Approve team |
| PUT | `/api/admin/participants/:teamId/reject` | Reject team |
| POST | `/api/admin/announcements` | Create announcement |

### Chat & Email
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/message` | AI chatbot response |
| POST | `/api/email/send` | Send email |
| POST | `/api/email/registration-success` | Registration success email |
| POST | `/api/email/payment-failure` | Payment failure email |

### Discord
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/discord/oauth` | Redirect to Discord OAuth |
| GET | `/api/discord/callback` | Handle OAuth callback |
| POST | `/api/discord/verify` | Verify Discord membership |

---

## 🗄️ Database Schema

### Core Models

| Model | Description |
|-------|-------------|
| `User` | User accounts with roles (PARTICIPANT, ADMIN, SPONSOR, MENTOR, JUDGE) |
| `Team` | Hackathon teams with category, theme, and status |
| `TeamMember` | Team-user relationships with roles and skills |
| `Payment` | Payment records with Razorpay integration |
| `Submission` | Project submissions (GitHub, video, PPT, APK) |
| `Sponsor` | Sponsor information and tiers |
| `Announcement` | Platform announcements |
| `Ticket` | Support tickets |
| `Referral` | Referral tracking |
| `CampusAmbassador` | Ambassador program data |
| `EventStats` | Real-time event statistics |

---

## 🎯 Features

### ✅ Implemented
- [x] Multi-step registration flow (5 steps)
- [x] Razorpay payment integration
- [x] Discord OAuth2 verification
- [x] Admin dashboard with analytics
- [x] Participant dashboard
- [x] AI chatbot (FAQ-based)
- [x] Email automation (Resend)
- [x] Team management
- [x] Project submission portal
- [x] Sponsor management
- [x] Support ticket system
- [x] Referral system
- [x] Campus ambassador portal

### 🚧 Coming Soon
- [ ] Live countdown timer
- [ ] QR ticket generation
- [ ] Real-time participant counter
- [ ] NFT certificates
- [ ] AI mentor assistant
- [ ] Live streaming integration
- [ ] Resume scanner

---

## 📝 Available Scripts

### Root
```bash
npm run dev              # Start both servers
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run build            # Build both
npm run start            # Start both in production
npm run install:all      # Install all dependencies
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio
```

### Frontend
```bash
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Backend
```bash
npm run dev              # Start with tsx watch
npm run build            # Compile TypeScript
npm run start            # Run compiled JS
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database
```

---

## 🎨 Design System

### Theme
- **Style**: Cyberpunk + AI + Gaming
- **Visual**: Futuristic UI, Neon aesthetics, Glassmorphism
- **Animations**: Particle backgrounds, Hover glow, Animated gradients

### Typography
| Usage | Font |
|-------|------|
| Titles | Orbitron |
| Content | Poppins |

### UI Effects
- Glassmorphism cards
- Particle backgrounds
- Hover glow effects
- Animated gradients
- Mouse trails
- Neon borders
- Motion transitions

---

## 📅 Event Timeline

| Phase | Date |
|-------|------|
| Registrations Open | May 18, 2026 |
| Hackathon Begins | June 12, 2026 |
| Final Submission | June 20, 2026 |
| Round 1 | June 20, 2026 |
| Round 2 | June 27-28, 2026 |
| Winner Announcement | June 28, 2026 |

---

## 💰 Pricing

| Category | Fee | Team Size |
|----------|-----|-----------|
| Students | ₹300/person | 2-5 members |
| IT Professionals | ₹1000/person | 2-3 members |
| Startups | ₹5000/company | 2 members |

---

## 🏆 Prize Pool

| Place | Prize |
|-------|-------|
| 1st Place | ₹1,00,000 |
| 2nd Place | ₹50,000 |
| 3rd Place | ₹25,000 |
| Best AI Innovation | ₹15,000 |
| Best Game Design | ₹15,000 |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Contact

- **Website**: [incuxai.com](https://incuxai.com)
- **Discord**: [Join Server](https://discord.gg/incuxai)
- **Instagram**: [@incuxai](https://instagram.com/incuxai)
- **Email**: hello@incuxai.com

---

<div align="center">

**Built with ❤️ for India's AI Gaming Community**

[⭐ Star this repo](#) · [🐛 Report Bug](#) · [💡 Request Feature](#)

</div>