import { prisma } from "../../../../lib/db";
import { NextResponse } from "next/server"

export async function GET(request: Request, contex: { params: { planID: string } }) {
  try {
    const { params } = await contex;
    const { planID } = await params;

    const plan = await prisma.plan.findUniqueOrThrow(
      {
        where: {
          id: planID,
        }
      }
    );
    return NextResponse.json(plan, { status: 200 });
  }
  catch (error) {
    return NextResponse.json({ error: `PlanID error: ${error.message}` }, { status: 503 });
  }
};

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("planID");
    const { hours, endDate } = await request.json();

    const plan = await prisma.plan.update({
      where: {
        id: id
      },
      data: {
        hours: hours,
        endDate: endDate
      }
    });
    return NextResponse.json(plan, { status: 200 });
  }
  catch (error) {
    return NextResponse.json({ error: `PlanID error: ${error.message}` }, { status: 503 });
  }
}
