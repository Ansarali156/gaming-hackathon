import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // This could be email or user identifier

    if (!code) {
      return NextResponse.json(
        { error: "Missing authorization code" },
        { status: 400 }
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/discord/callback`,
        scope: "identify guilds",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user info from Discord
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch Discord user info");
    }

    const discordUser = await userResponse.json();

    // Find or create user in our database
    // In a real implementation, you'd match this with the user who initiated the registration
    // For now, we'll just store the Discord info
    const user = await prisma.user.upsert({
      where: { email: state || `${discordUser.id}@discord.placeholder` },
      update: {
        discordId: discordUser.id,
        discordJoined: true,
        image: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
      },
      create: {
        email: state || `${discordUser.id}@discord.placeholder`,
        name: discordUser.username,
        discordId: discordUser.id,
        discordJoined: true,
        image: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
        role: "PARTICIPANT",
      },
    });

    // Redirect back to registration with success
    const redirectUrl = new URL("/register", process.env.NEXTAUTH_URL);
    redirectUrl.searchParams.set("discord_verified", "true");
    redirectUrl.searchParams.set("userId", user.id);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Discord OAuth error:", error);
    const redirectUrl = new URL("/register", process.env.NEXTAUTH_URL);
    redirectUrl.searchParams.set("discord_error", "true");
    return NextResponse.redirect(redirectUrl);
  }
}