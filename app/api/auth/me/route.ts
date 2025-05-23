import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { UserService } from "@/src/services/userServices";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
    const userService=new UserService()
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    //const token = authHeader.split(" ")[1];
    
    //const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const user = await userService.getCurrentUser();
    console.log(user)
    if (!user) throw new Error();

    const { haslo, ...userData } = user;
    return NextResponse.json(userData);
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }
}