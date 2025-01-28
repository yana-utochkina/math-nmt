import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { isValidEmail, isValidName, isValidPassword } from "../route";
import { User } from "@prisma/client";

export async function GET(req: Request, context: { params: { userID: string } }) {
  try {
    const { params } = await context;
    const { userID } = await params;

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userID }
    });

    return NextResponse.json(user, { status: 200 });
  }
  catch (error) {
    return NextResponse.json({ error: `Failed to fetch user ${error.message}` }, { status: 500 });
  }
};

export async function PUT(request: Request, context: { params: { userID: string } }) {
  try {
    const { params } = await context;
    const { userID } = await params;

    const body = await request.json();

    if (!body.firstName) throw new Error("Require firstname");
    if (!body.nickname) throw new Error("Require nickname");
    if (!body.email) throw new Error("Require email");
    if (!body.password) throw new Error("Require password");

    if (!isValidName(body.nickname)) throw new Error("Nickname must include: A-Z,a-z,0-9 and must be up to 20 symbols");
    if (!isValidEmail(body.email)) throw new Error("Invalid email");
    if (!isValidPassword(body.password)) throw new Error("The password must include: A-Z,a-z,0-9 and must have a length 8-20 symbols");

    const user: User = body;

    const updatedUser = await prisma.user.update({
      where: { id: userID },
      data: user
    });

    return NextResponse.json(updatedUser, { status: 200 });
  }
  catch (error) {
    return NextResponse.json({ error: `Failed to update user: ${error.message}` }, { status: 500 });
  }
};

export async function PATCH(request: Request, context: { params: { userID: string } }) {
  try {
    const { params } = await context;
    const { userID } = await params;

    const body = await request.json();

    if (body.nickname) if (!isValidName(body.nickname)) throw new Error("Nickname must include: A-Z,a-z,0-9 and must be up to 20 symbols");
    if (body.email) if (!isValidEmail(body.email)) throw new Error("Invalid email");
    if (!body.password) if (!isValidPassword(body.password)) throw new Error("The password must include: A-Z,a-z,0-9 and must have a length 8-20 symbols");

    const user: User = body;

    const updatedUser = await prisma.user.update({
      where: { id: userID },
      data: user
    });

    return NextResponse.json(updatedUser, { status: 200 });
  }
  catch (error) {
    return NextResponse.json({ error: `Failed to update user: ${error.message}` }, { status: 500 });
  }
};

export async function DELETE(request: Request, context: { params: { userID: string } }) {
  try {
    const { params } = await context;
    const { userID } = await params;

    const deletedUser = await prisma.user.delete({
      where: {
        id: userID,
      }
    });
  }
  catch (error) {
    return NextResponse.json({ error: `Failed to delete user: ${error.message}` }, { status: 500 });
  }
}