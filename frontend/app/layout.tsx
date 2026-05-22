import type { Metadata } from "next";
import { Fredoka, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { ParticleBackground } from "@/components/ui/ParticleBackground";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IncuXai AI Gaming Hackathon | India's Ultimate AI Gaming Hackathon",
  description: "Build intelligent games, AI systems & immersive experiences with developers, gamers, startups & innovators. India's First Large-Scale AI Gaming Innovation Festival.",
  keywords: ["AI", "Gaming", "Hackathon", "India", "Innovation", "Startup", "Developer"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${poppins.variable}`}>
      <body className="bg-background text-text">
        <Providers>
          <ParticleBackground />
          {children}
          <FloatingActions />
        </Providers>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
