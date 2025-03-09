import { NextResponse } from "next/server";
import { isValidNickname, isValidEmail, isValidPassword } from "@/lib/validator/user";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";


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

    if (!isValidNickname(body.nickname)) throw new Error("Nickname must include: A-Z,a-z,0-9 and must be up to 20 symbols");
    if (!isValidEmail(body.email)) throw new Error("Invalid email");
    if (!isValidPassword(body.password)) throw new Error("The password must include: A-Z,a-z,0-9 and must have a length 8-20 symbols");

    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Generate verification token
    const verificationToken = crypto.randomUUID();

    // Create user in the database
    await prisma.user.create({
      data: {
        nickname: body.nickname,
        email: body.email,
        password: hashedPassword,
        verificationToken,
      },
    });

    // Return success response with token
    return NextResponse.json(
        { message: "User registered. Check your email to verify.", token: verificationToken },
        { status: 201 }
    );

  }
  catch (error) {

    if (error.code === "P2002") {
      return NextResponse.json({ error: "This email has already been registered" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }

}

