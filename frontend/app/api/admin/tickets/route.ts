import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    console.error("Fetch tickets error:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { ticketId, status, response, assignedTo } = body;

    const data: any = {};
    if (status) data.status = status as TicketStatus;
    if (response !== undefined) data.response = response;
    if (assignedTo !== undefined) data.assignedTo = assignedTo;

    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data,
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error("Update ticket error:", error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}

