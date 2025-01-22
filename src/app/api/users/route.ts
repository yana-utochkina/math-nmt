//Тут створити: 
// 1)Create запит(POST) на створення юзера в бд (в параметрах пошта і пароль)
// 2)Read запит(GET) на отримання списку юзерів
//   Update запит (PUT) на оновлення списку юзерів
//   Delete запит (DELETE) на видалення списку юзерів

import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
//import bcrypt from "bcrypt";

function isValidPassword(password: string): boolean {
  const passwordRegex = /^[A-Za-z0-9]+$/;
  return passwordRegex.test(password) && password.length >= 8 && password.length <= 20;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidName(name: string): boolean {
  const nameRegex = /^[A-Za-z0-9]+$/;
  return name.length <= 20 && nameRegex.test(name);
};


// Create запит(POST) на створення юзера в бд (в параметрах пошта і пароль)
export const POST = async (req: Request) => {
  try {
    const { email, password, repPassword, nickname } = await req.json();

  if (!email || !password || !repPassword || !nickname) {
    return new NextResponse(
     JSON.stringify({ message: "Fill in all fields" }),
      { status: 400 });
  }

  if (!isValidEmail(email)) {
    return new NextResponse(
      JSON.stringify({ message: "Email is invalid" }),
    { status: 400});
  }

  if (!isValidPassword(password)) {
    return new NextResponse(
      JSON.stringify({ message: "The password must include: A-Z,a-z,0-9 and must have a length 8-20 symbols" }),
    { status: 400});
  }

  if (!isValidName(nickname)) {
    return new NextResponse(
      JSON.stringify({ message: "Name must include: A-Z,a-z,0-9 and must be up to 20 symbols" }),
    { status: 400});
  }

  if(password!=repPassword) {
    return new NextResponse(
      JSON.stringify({ message: "Check your password" }),
    { status: 400});
  }
    //const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
          email: email,
          password: password,
          nickname: nickname,
          firstName: " "
        }
      });
      

    return NextResponse.json(
      { message: "User is created", user: newUser},
      { status: 200 });

  } catch (error: any) {

    if (error.code === "P2002") {
      return new NextResponse(
        JSON.stringify({ error: "This email has already been registered" }),
        { status: 409 });
    }
    console.error("Error: ", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to add user" }),
      { status: 500 });
  }
}


//Read запит(GET) на отримання списку юзерів
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nickname: true,
        firstName: true,
      },
    });

    if (users.length === 0) {
      return NextResponse.json(
        { message: "No users found" },
        { status: 404 }
      );
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error("Error: ", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch users" }),
      { status: 500 }
    );
  }
}

//Delete запит (DELETE) на видалення списку юзерів
export const DELETE = async () => {
  try {
    // Виконуємо транзакцію для видалення всіх даних, пов'язаних із користувачами
    await prisma.$transaction([
      prisma.userTask.deleteMany({}), // Видаляємо всі записи UserTask
      prisma.planTask.deleteMany({}), // Видаляємо всі записи PlanTask
      prisma.plan.deleteMany({}),     // Видаляємо всі записи Plan
      prisma.user.deleteMany({}),     // Видаляємо всіх користувачів
    ]);

    return NextResponse.json(
      { message: "All users and related data successfully deleted" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting all users and related data:", error);

    return NextResponse.json(
      { error: "Failed to delete all users and related data" },
      { status: 500 }
    );
  }
};

export async function PATCH() {
  return new NextResponse(`Not implemented error`, { status: 501 });
}


