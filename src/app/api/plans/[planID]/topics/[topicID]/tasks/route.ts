// Read-запит на діставання id та description завдань конкретної теми та прогрес кожного завдання
// 
import { NextResponse } from "next/server";
import { prisma } from "../../../../../../../lib/db";

export async function GET(request: Request, contex: { params: { planID: string } }) {
  try {
    const { params } = await contex;
    const { planID } = await params;

    const tasks = await prisma.plan.findUniqueOrThrow(
      {
        where: {
          id: planID,
        }
      }
    );
    return NextResponse.json(tasks, { status: 200 });
  }
  catch (error) {
    return NextResponse.json({ error: `Tasks error: ${error.message}` }, { status: 503 });
  }
};

export const POST = async (request: Request, contex: any) => {
  try {
    const { params } = contex;
    const topicID = params.topicID;
    const { description, problem, solution, type, answer } = await request.json();
    const task = await prisma.task.create({
      data: {
        description: description,
        problem: problem,
        solution: solution,
        type: type,
        answer: answer,
        topicID: topicID,
      }
    });
    return NextResponse.json(task, { status: 200 });
  }
  catch (error: any) {
    return NextResponse.json({ error: `Prisma error: ${error.message}` }, { status: 503 });
  }
};

export const PATCH = async (request: Request) => {
  return new NextResponse(`Not implemented error`, { status: 501 });
}

export const DELETE = async (request: Request) => {
  return new NextResponse(`Not implemented error`, { status: 501 });
}