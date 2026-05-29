import type { Metadata } from "next";
import { Poppins } from "next/font/google";
// Script intentionally removed: Razorpay checkout was removed
import "./globals.css";
import { Providers } from "@/components/Providers";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Chatbot } from "@/components/layout/Chatbot";
import { ParticleBackground } from "@/components/ui/ParticleBackground";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://incuxai.com"),
  title: {
    default: "AI Gaming Hackathon | India's Ultimate AI Gaming Innovation Festival",
    template: "%s | AI Gaming Hackathon"
  },
  description: "Build intelligent games, AI systems, and immersive gaming experiences. Connect with elite developers, gamers, startups, and mentors at India's first large-scale AI Gaming Hackathon. Over ₹10 Lakhs in cash prizes, internships, incubation & seed investment.",
  keywords: [
    "AI Gaming Hackathon", "Artificial Intelligence", "Game Development", 
    "Esports Analytics", "AI NPC", "Procedural Content Generation", 
    "AR/VR Gaming", "Web3 Gaming", "Hackathon India 2026", "IncuXai"
  ],
  authors: [{ name: "IncuXai Team" }],
  creator: "IncuXai",
  publisher: "IncuXai",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://incuxai.com",
    title: "AI Gaming Hackathon | India's Ultimate AI Gaming Innovation Festival",
    description: "Connect, build, and battle. Join elite students, startups, and game developers in India's first large-scale AI Gaming Hackathon with prizes worth ₹10 Lakhs.",
    siteName: "AI Gaming Hackathon",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "IncuXai AI Gaming Hackathon 2026 Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Gaming Hackathon | India's Ultimate AI Gaming Innovation Festival",
    description: "Join India's premier AI Gaming Hackathon. Build AI NPCs, procedural content, and immersive AR/VR games. Cash prize pool of ₹10,00,000!",
    images: ["/images/og-image.jpg"],
    creator: "@incuxai",
  },
  alternates: {
    canonical: "https://incuxai.com",
  },
  icons: {
    icon: "/incuxai_new.png",
    shortcut: "/incuxai_new.png",
    apple: "/incuxai_new.png",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} dark`}>
      <body className="bg-background text-text antialiased min-h-screen">
        <Providers>
          <ParticleBackground />
          {children}
          <FloatingActions />
          <Chatbot />
        </Providers>
        {/* Razorpay checkout removed — payments handled by external SUN endpoint */}
      </body>
    </html>
  );
}
