import { NextRequest, NextResponse } from "next/server";
import connection from "@/lib/mongoDb";
import UserModel from "@/app/Model/User";

export async function GET(req: NextRequest) {
  await connection;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const user = await UserModel.findOne({ id });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  }

  const users = await UserModel.find();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  try {
    await connection;

    const { id, imie, nazwisko, login, haslo, rola } = await req.json();
    if (!id || !login || !haslo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Optional: Check if user already exists
    const existingUser = await UserModel.findOne({ login });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const newUser = new UserModel({
      id,
      imie,
      nazwisko,
      login,
      haslo,
      rola
    });
    //console.log(newUser)
    await newUser.save();
    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });

  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}