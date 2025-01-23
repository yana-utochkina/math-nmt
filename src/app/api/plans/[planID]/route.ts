/* eslint-disable rule-name */
import { prisma } from "../../../../lib/db";
import { NextResponse } from "next/server"

export const GET = async (request: Request, contex: any) => {
  try {
    const { params } = contex;
    const id = params.planID;

    const plan = await prisma.plan.findUniqueOrThrow(
      {
        where: {
          id: id
        }
      }
    );
    return NextResponse.json(plan, { status: 200 });
  }
  catch (error: any) {
    return NextResponse.json({ error: `PlanID error: ${error.message}` }, { status: 503 });
  }
};


export const PATCH = async (request: Request) => {
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
  catch (error: any) {
    return NextResponse.json({ error: `PlanID error: ${error.message}` }, { status: 503 });
  }
}
/* eslint-enable rule-name */
