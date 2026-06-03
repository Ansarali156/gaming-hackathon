import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // This is just a callback endpoint that will be handled by the main route
  // The actual logic is in the route.ts file above
  return NextResponse.redirect(new URL("/register", process.env.NEXTAUTH_URL!));
}