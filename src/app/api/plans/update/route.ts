// File: app/api/plans/update/route.ts


import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userID, planID, progressUpdates } = body;

    for (const update of progressUpdates) {
      await prisma.planTask.upsert({
        where: {
          planID_taskID: {
            planID,
            taskID: update.topicID,
          },
        },
        update: {
          // Оновлення прогресу для теми (за потреби, якщо є додаткові поля)
        },
        create: {
          planID,
          taskID: update.topicID,
        },
      });
    }

    return NextResponse.json({ message: "План оновлено" });
  } catch (error: any) {
    console.error("Error updating plan:", error);
    return NextResponse.json(
      { error: "Сталася помилка при оновленні плану" },
      { status: 500 }
    );
  }
}
