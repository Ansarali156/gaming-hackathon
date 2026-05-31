import { prisma } from "./prisma";

export async function generateTeamId(): Promise<string> {
  const prefix = "INC";
  const year = new Date().getFullYear().toString().slice(-2);
  
  const count = await prisma.team.count();
  const number = (count + 1).toString().padStart(4, "0");
  
  return `${prefix}${year}${number}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
