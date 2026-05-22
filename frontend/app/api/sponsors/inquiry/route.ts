import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.sponsorshipInquiry.create({
      data: {
        name,
        email,
        phone,
        company,
        message,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error("Sponsor inquiry error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
