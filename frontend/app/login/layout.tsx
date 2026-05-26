import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Participant Login & Dashboard",
  description: "Sign in to your AI Gaming Hackathon participant dashboard. Submit project milestones, check announcements, and access mentor resources.",
  alternates: {
    canonical: "https://incuxai.com/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
