// Read-запит на діставання інфи про юзера
// Update-запит на зміну профіля (можна змінити firstName, nickname)
// Delete-запит на видалення з бд

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

// Read-запит на діставання інфи про юзера(для профілю)
export const GET = async (req: Request, { params }: { params: { userID: string } }) => {
  try {
    const { userID: userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        //password:true,
        nickname: true,
        firstName: true,
      }

    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
};

const isValidName = (name: string): boolean => {
  const nameRegex = /^[A-Za-z0-9 ]+$/;
  return name.length <= 20 && nameRegex.test(name);
};

// Update-запит на зміну профіля (в профілі можна змінити firstName, nickname)
export const PUT = async (req: Request, { params }: { params: { userID: string } }) => {
  try {
    const { userID: userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { firstName, nickname } = await req.json();

    if (firstName && !isValidName(firstName)) {
      return NextResponse.json(
        { error: "Name must include: A-Z,a-z,0-9 and must be up to 20 symbols",},
        { status: 400 }
      );
    }

    if (nickname && !isValidName(nickname)) {
      return NextResponse.json(
        { error: "Nickname must include: A-Z,a-z,0-9 and must be up to 20 symbols",},
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName !== undefined ? firstName : undefined,
        nickname: nickname !== undefined ? nickname : undefined,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
};

// Delete-запит на видалення з бд
export const DELETE = async (req: Request, { params }: { params: { userID: string } }) => {
  try {
    const { userID: userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Перевіряємо, чи існує користувач перед видаленням
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    //видалення супутніх даних
    await prisma.$transaction([
      prisma.userTask.deleteMany({
        where: { userID: userId },
      }),
      prisma.planTask.deleteMany({
        where: { userId: userId },
      }),
      prisma.plan.deleteMany({
        where: { userID: userId },
      }),
      // prisma.user.delete({
      //   where: { id: userId },
      // }),
    ]);

    //Видалення користувача
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: `User with ID ${userId} successfully deleted` },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting user:', error);

    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request, { params }: { params: { userID: string } }) => {}