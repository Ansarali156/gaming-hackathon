"use client";

import { SessionProvider } from "next-auth/react";
import { ChatBot } from "@/components/ui/ChatBot";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <ChatBot />
    </SessionProvider>
  );
}
