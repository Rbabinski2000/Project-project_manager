import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const { refreshToken } = await req.json();

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as any;
    const newToken = jwt.sign({ id: payload.id, login: payload.login }, JWT_SECRET, { expiresIn: "15m" });
    return NextResponse.json({ token: newToken });
  } catch {
    return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
  }
}