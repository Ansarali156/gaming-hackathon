# 🎮 IncuXAI — India's Ultimate AI Gaming Hackathon Platform

> **Build. Battle. Innovate & Conquer.**

A modern, full-stack AI Gaming Hackathon platform built on Next.js 15, featuring Razorpay integration, Discord verification, an admin dashboard, and community tools.

---

## 📁 Project Structure

```text
incuxai-platform/
├── app/                      # Next.js 15 App Router (Pages & API)
│   ├── (auth)/               # Login, register, and password reset pages
│   ├── api/                  # Next.js API Routes (Backend Logic)
│   │   ├── admin/            # Admin endpoints
│   │   ├── auth/             # NextAuth integration
│   │   ├── discord/          # Discord OAuth & verification
│   │   ├── payments/         # Razorpay webhooks & verification
│   │   ├── register/         # Team registration processing
│   │   └── teams/            # Team management APIs
│   ├── dashboard/            # Participant & admin dashboards
│   ├── sponsors/             # Sponsor landing page
│   ├── globals.css           # Global Tailwind styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/               # React components
│   ├── layout/               # Header, Footer, FloatingActions
│   ├── sections/             # Landing page sections
│   └── ui/                   # ChatBot, ParticleBackground, Modals
├── lib/                      # Core Utilities
│   ├── authOptions.ts        # NextAuth configuration
│   ├── prisma.ts             # Prisma DB client
│   └── sunForwarder.ts       # Registration integrations
├── prisma/                   # Database schema
│   └── schema.prisma         # Prisma schema
├── .env.example              # Environment variables template
├── next.config.mjs           # Next.js configuration
├── eslint.config.mjs         # Strict ESLint config
├── package.json              # Unified project dependencies
└── tsconfig.json             # TypeScript configuration
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (Node 24+ recommended)
- PostgreSQL database
- npm

### 1. Clone & Install

```bash
# Install dependencies
npm install
```

### 2. Setup Environment Variables

Copy the `.env.example` file to `.env` and fill in your secrets.

```bash
cp .env.example .env
```

**Required `.env` Variables**:
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

DATABASE_URL="postgresql://user:password@host/dbname"

# Payments (Razorpay)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_secret_..."

# Email
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

### 3. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view tables
npx prisma studio
```

### 4. Run Development Server

```bash
# Start the full-stack Next.js dev server
npm run dev
```

The application will be available at **http://localhost:3000**.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.1 | Full-stack React framework (Frontend & API) |
| **React** | 19 | UI library |
| **TypeScript** | 5.8 | Strict Type safety |
| **Prisma** | 6.5 | ORM for PostgreSQL |
| **PostgreSQL** | 15+ | Relational Database |
| **Tailwind CSS** | 4.1 | Utility-first styling |
| **NextAuth** | 4.24 | Session Authentication |
| **Framer Motion** | 12.23 | Fluid animations |
| **Razorpay** | 2.9 | Payment gateway integration |
| **bcryptjs** | 2.4 | Password hashing |

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

---

## 🎯 Features

### ✅ Implemented
- [x] Full-Stack Next.js Architecture (No separate backend required)
- [x] Multi-step registration flow
- [x] Razorpay payment integration
- [x] Discord OAuth2 verification
- [x] Admin dashboard with analytics
- [x] Participant dashboard
- [x] AI chatbot (FAQ-based)
- [x] Team management
- [x] Project submission portal
- [x] Support ticket & Referral system

### 🚧 Coming Soon
- [ ] Live countdown timer
- [ ] QR ticket generation
- [ ] Real-time participant counter
- [ ] NFT certificates
- [ ] AI mentor assistant
- [ ] Resume scanner

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

---

## 📅 Event Timeline

| Phase | Date |
|-------|------|
| Registrations Open | May 25, 2026 |
| Registration Closes & Round 1 Submission | June 25, 2026 |
| Round 1 Results | June 28, 2026 |
| Round 2 Offline | July 4-5, 2026 |
| Winner Announcement | July 5, 2026 |

---

## 💰 Pricing & 🏆 Prize Pool

| Category | Fee | Team Size |
|----------|-----|-----------|
| Students | ₹300/person | 2-5 members |
| IT Professionals | ₹1000/person | 2-4 members |
| Startups | ₹1000/person | 2-4 members |

**Total Prize Pool: ₹10,00,000+**
- Grand Prize: Up to ₹10,00,000
- Additional Opportunities: Creative Ideas, Internships, Incubation, and Startup Investments.

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
</div>