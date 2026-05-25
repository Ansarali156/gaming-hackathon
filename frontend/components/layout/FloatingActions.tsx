"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Instagram, MessageCircle, Mail, UserPlus } from "lucide-react";

const actions = [
  { icon: <UserPlus size={20} />, href: "/register", label: "Register", color: "bg-primary text-background" },
  { icon: <Instagram size={20} />, href: "https://www.instagram.com/incuxai", label: "Instagram", color: "bg-pink-600 text-white" },
  { icon: <MessageCircle size={20} />, href: "https://discord.gg/8gaK52vEs", label: "Discord", color: "bg-indigo-600 text-white" },
  { icon: <Mail size={20} />, href: "mailto:incuxaigaming@gmail.com", label: "Email", color: "bg-secondary text-white" },
];

export function FloatingActions() {
  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col gap-3">
      {actions.map((action, i) => (
        <motion.a
          key={action.label}
          href={action.href}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}
          title={action.label}
        >
          {action.icon}
        </motion.a>
      ))}
    </div>
  );
}
