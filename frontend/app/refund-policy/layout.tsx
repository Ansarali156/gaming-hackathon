import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Read our registration fee refund policy details for the IncuXai AI Gaming Hackathon.",
  alternates: {
    canonical: "https://incuxai.com/refund-policy",
  },
};

export default function RefundPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
