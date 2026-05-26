import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the official terms and conditions of participation for the IncuXai AI Gaming Hackathon.",
  alternates: {
    canonical: "https://incuxai.com/terms-of-service",
  },
};

export default function TermsOfServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
