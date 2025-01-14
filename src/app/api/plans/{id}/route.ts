// Read-запит на отримання плану : (як виглядає план) {діставати прогрес по кожній темі}
// Update-запит на зміну плану (в параметрах hours : int, endDate : DateType????)
// Delete на видалення з бд

"use server";
import { prisma } from "../../../../lib/db";
import { NextResponse } from "next/server"

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse(JSON.stringify({ message: "User id is invalid" }), { status: 400 });
    }

    const plans = await prisma.plan.findUnique(
      {
        where: {
          id: id
        }
      }
    );
    return new NextResponse(JSON.stringify(plans), { status: 201 });
  }
  catch (error: any) {
    return new NextResponse("Error in users" + error.message, { status: 500 });
  }
};
