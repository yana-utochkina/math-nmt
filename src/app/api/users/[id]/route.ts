// Read-запит на діставання інфи про юзера
// Update-запит на зміну профіля (можна змінити firstName, nickname)
// Delete-запит на видалення з бд

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

// Read-запит на діставання інфи про юзера(для профілю)
export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id: userId } = params;

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: "User ID is required" }),
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
      return new NextResponse(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch user" }),
      { status: 500 }
    );
  }
};

const isValidName = (name: string): boolean => {
  const nameRegex = /^[A-Za-z0-9 ]+$/;
  return name.length <= 20 && nameRegex.test(name);
};

// Update-запит на зміну профіля (в профілі можна змінити firstName, nickname)
export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id: userId } = params;

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400 }
      );
    }

    const { firstName, nickname } = await req.json();

    if (firstName && !isValidName(firstName)) {
      return new NextResponse(
        JSON.stringify({
          error: "Name must include: A-Z,a-z,0-9 and must be up to 20 symbols",
        }),
        { status: 400 }
      );
    }

    if (nickname && !isValidName(nickname)) {
      return new NextResponse(
        JSON.stringify({
          error: "Nickname must include: A-Z,a-z,0-9 and must be up to 20 symbols",
        }),
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

    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to update user" }),
      { status: 500 }
    );
  }
};

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {}

export const POST = async (req: Request, { params }: { params: { id: string } }) => {}

  // Delete-запит на видалення з бд

  // export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  //   try {
  //     const { id: userId } = params;
  
  //     if (!userId) {
  //       return new NextResponse(
  //         JSON.stringify({ message: "User ID is required" }),
  //         { status: 400 }
  //       );
  //     }
  
  //     // Проверяем, существует ли пользователь
  //     const userExists = await prisma.user.findUnique({
  //       where: { id: userId },
  //     });
  
  //     if (!userExists) {
  //       return new NextResponse(
  //         JSON.stringify({ error: "User not found" }),
  //         { status: 404 }
  //       );
  //     }
  
  //     // Удаляем все связанные с пользователем записи в таблице Plan
  //     await prisma.plan.deleteMany({
  //       where: { userID: userId },
  //     });
  
  //     // Удаляем все связанные с пользователем записи в таблице UserTask
  //     await prisma.userTask.deleteMany({
  //       where: { userID: userId },
  //     });

  //     // Удаляем все связанные с пользователем записи в таблице PlanTask
  //     await prisma.planTask.deleteMany({
  //       where: { planID: { in: (await prisma.plan.findMany({ where: { userID: userId }, select: { id: true } })).map(plan => plan.id) } },
  //     });
  
  //     // После того как связанные записи удалены, удаляем самого пользователя
  //     const deletedUser = await prisma.user.delete({
  //       where: { id: userId },
  //     });
  
  //     return new NextResponse(
  //       JSON.stringify({ message: "User and related data deleted", user: deletedUser }),
  //       { status: 200 }
  //     );
  //   } catch (error: any) {
  //     console.error("Error deleting user and related data:", error);
  //     return new NextResponse(
  //       JSON.stringify({ error: "Failed to delete user and related data", details: error.message }),
  //       { status: 500 }
  //     );
  //   }
  // };