import { NextResponse } from "next/server";
import { prisma } from "@db";
import { User } from "@prisma/client";
//import bcrypt from "bcrypt";


export function isValidPassword(password: string): boolean {
  const passwordRegex = /^[A-Za-z0-9]+$/;
  return passwordRegex.test(password) && password.length >= 8 && password.length <= 20;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidName(name: string): boolean {
  const nameRegex = /^[A-Za-z0-9]+$/;
  return name.length <= 20 && nameRegex.test(name);
};


export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  }
  catch (error) {
    return NextResponse.json({ error: `Failed to fetch users: ${error.message}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.nickname) throw new Error("Require nickname");
    if (!body.email) throw new Error("Require email");
    if (!body.password) throw new Error("Require password");

    if (!isValidName(body.nickname)) throw new Error("Nickname must include: A-Z,a-z,0-9 and must be up to 20 symbols");
    if (!isValidEmail(body.email)) throw new Error("Invalid email");
    if (!isValidPassword(body.password)) throw new Error("The password must include: A-Z,a-z,0-9 and must have a length 8-20 symbols");

    //const hashedPassword = await bcrypt.hash(password, 10);

    const user: User = body;

    const newUser = await prisma.user.create({ data: user });


    return NextResponse.json(newUser, { status: 200 });

  }
  catch (error) {

    if (error.code === "P2002") {
      return NextResponse.json({ error: "This email has already been registered" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}