import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Topic } from "@prisma/client";

export async function GET(request: Request) {
  try {
    // Отримуємо всі теми (можна вибрати лише потрібні поля)
    const topics = await prisma.topic.findMany({
      select: {
        id: true,
        title: true,
        // при потребі додайте інші поля
      },
    });
    return NextResponse.json(topics);
  } catch (error: any) {
    console.error("Error fetching topics:", error);
    return NextResponse.json({ error: "Сталася помилка" }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.parentID) throw new Error("Require parentID");
        if (!body.title) throw new Error("Require title");

        const topic: Topic = body;

        const newTopic = await prisma.topic.create({ data: topic });

        return NextResponse.json(newTopic, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ error: `Wrong topics creating params: ${error.message}` }, { status: 400 });
    }
}
