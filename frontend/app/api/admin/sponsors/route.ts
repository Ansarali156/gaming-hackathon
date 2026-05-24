import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: { createdAt: "desc" },
    });
    const inquiries = await prisma.sponsorshipInquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, sponsors, inquiries });
  } catch (error) {
    console.error("Fetch sponsors error:", error);
    return NextResponse.json({ error: "Failed to fetch sponsors" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, tier, logo, website, description, contact, isActive } = body;

    const sponsor = await prisma.sponsor.create({
      data: {
        name,
        tier,
        logo,
        website,
        description,
        contact,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, sponsor });
  } catch (error) {
    console.error("Create sponsor error:", error);
    return NextResponse.json({ error: "Failed to create sponsor" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    
    // Handle Inquiry updates
    if (body.inquiryId !== undefined) {
      const inquiry = await prisma.sponsorshipInquiry.update({
        where: { id: body.inquiryId },
        data: { status: body.status },
      });
      return NextResponse.json({ success: true, inquiry });
    }

    // Handle Sponsor updates
    const { sponsorId, name, tier, logo, website, description, contact, isActive } = body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (tier !== undefined) data.tier = tier;
    if (logo !== undefined) data.logo = logo;
    if (website !== undefined) data.website = website;
    if (description !== undefined) data.description = description;
    if (contact !== undefined) data.contact = contact;
    if (isActive !== undefined) data.isActive = isActive;

    const sponsor = await prisma.sponsor.update({
      where: { id: sponsorId },
      data,
    });

    return NextResponse.json({ success: true, sponsor });
  } catch (error) {
    console.error("Update sponsor error:", error);
    return NextResponse.json({ error: "Failed to update sponsor" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sponsorId = searchParams.get("sponsorId");

    if (!sponsorId) {
      return NextResponse.json({ error: "Sponsor ID is required" }, { status: 400 });
    }

    await prisma.sponsor.delete({
      where: { id: sponsorId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete sponsor error:", error);
    return NextResponse.json({ error: "Failed to delete sponsor" }, { status: 500 });
  }
}

