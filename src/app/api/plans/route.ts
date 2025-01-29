import { Plan } from "@prisma/client";
import { prisma } from "../../../lib/db";
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const plans = await prisma.plan.findMany();
        return NextResponse.json(plans, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: `Prisma error: ${error.message}` }, { status: 503 });
    }
};

export async function POST(request: Request) {
  try {
    const { userID, hours, endDate } = await request.json();

    // Валідація даних
    if (!userID) return NextResponse.json(
      { error: "Необхідна авторизація" }, 
      { status: 401 }
    );

    if (!hours || !endDate) return NextResponse.json(
      { error: "Заповніть всі поля" }, 
      { status: 400 }
    );

    const newPlan = await prisma.plan.create({
      data: {
        userID,
        hours: Number(hours),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json(newPlan, { status: 201 });

  } catch (error: any) {
    console.error("Error creating plan:", error);
    
    // Обробка помилок Prisma
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "План для цього користувача вже існує" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Помилка сервера: " + error.message },
      { status: 500 }
    );
  }
}