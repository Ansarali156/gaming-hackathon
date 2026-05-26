import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Team",
  description: "Register your team for India's ultimate AI Gaming Hackathon. Compete across 7 challenge tracks including AI NPCs, PCG, AR/VR, and Web3. Open to students, professionals, and startups.",
  alternates: {
    canonical: "https://incuxai.com/register",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
