// Read-запит на діставання id та description завдань конкретної теми та прогрес кожного завдання
// 
import { NextResponse } from "next/server";
import { prisma } from "../../../../../../../lib/db";

export const GET = async (request: Request, contex: any) => {
  try {
    const { params } = contex;
    const topicID = params.topicID;
    const tasks = await prisma.task.findMany({
      where: {
        topicID: topicID,
      },
    });
    return NextResponse.json(tasks, { status: 200 });
  }
  catch (error: any) {
    return NextResponse.json({ error: `TopicID error: ${error.message}` }, { status: 503 });
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