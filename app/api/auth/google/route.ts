import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

export async function POST(req: NextRequest) {
  const { credential } = await req.json();


  try {
    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

    const userEmail = payload.email;
    // TODO: Authenticate or create user in your DB
    //zaloguj jako gość

    
    // Return your tokens
    return NextResponse.json({
      token: "yourAppToken",
      refreshToken: "yourRefreshToken",
    });
  } catch (error) {
    return NextResponse.json({ error: "Auth failed" }, { status: 401 });
  }
}
