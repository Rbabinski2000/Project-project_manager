import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { UserService } from "@/src/services/userServices";

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export async function POST(req: Request) {
  
  const { login, haslo } = await req.json();
  
  const userService=new UserService();
  const user = userService.getByLogin(login);
  //console.log(user)
  if (!user || haslo!=user.haslo) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }
  
  const payload = { id: user.id, login: user.imie };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

  return NextResponse.json({ token, refreshToken });
}