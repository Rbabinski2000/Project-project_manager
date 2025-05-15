import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoDb";
import User from "@/app/Model/User";

export async function GET() {
  await connectDB();
  const users = await User.find();
  return NextResponse.json(users);
}
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { id, imie, nazwisko, login, haslo, rola } = await req.json();

    if (!id || !login || !haslo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Optional: Check if user already exists
    const existingUser = await User.findOne({ login });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const newUser = new User({
      id,
      imie,
      nazwisko,
      login,
      haslo,
      rola
    });
    console.log(newUser)
    await newUser.save();
    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });

  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}