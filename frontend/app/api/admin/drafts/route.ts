import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const drafts = await prisma.pendingRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ drafts });
  } catch (error: any) {
    console.error("Fetch drafts error:", error);
    return NextResponse.json({ error: "Failed to fetch drafts", details: error?.message || String(error) }, { status: 500 });
  }
}
