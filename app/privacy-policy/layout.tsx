import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the official privacy policy and data security guidelines of the IncuXai AI Gaming Hackathon.",
  alternates: {
    canonical: "https://incuxai.com/privacy-policy",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
