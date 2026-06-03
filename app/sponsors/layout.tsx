import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Partner & Sponsor",
  description: "Partner with India's largest AI Gaming Innovation Festival. Unlock exclusive access to top-tier developer talent, student innovators, and start-up game developers.",
  alternates: {
    canonical: "https://incuxai.com/sponsors",
  },
};

export default function SponsorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
