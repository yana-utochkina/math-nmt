import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

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

export async function GET(request: Request, context: { params: { planID: string, topicID: string } }) {
    const result = await prisma.task.findMany({
        where: {
            topicID: '721eea05-073b-45ea-8239-6459bddc6b0d',
            PlanTask: {
                some: {
                    planID: '7e670d32-b02a-4144-a7db-32cd1ce0fda0'
                }
            }
        },
        include: {
            PlanTask: {
                where: {
                    planID: '7e670d32-b02a-4144-a7db-32cd1ce0fda0'
                }
            },
            UserTask: {
                where: {
                    userID: '4a57e5ff-28b2-4489-8a5b-49b3162ffb15'
                }
            }
        }
    });

    return NextResponse.json(result);
}

