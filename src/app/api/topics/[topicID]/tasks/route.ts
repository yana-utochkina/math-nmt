import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";
import { Task } from "../../../../../lib/types";
import { AnswerType } from "@prisma/client";

export async function GET(request: Request, context: { params: { topicID: string } }) {
    try {
        const { params } = await context;
        const { topicID } = await params;
        const tasks = await prisma.task.findMany({
            where: {
                topicID: topicID,
            },
        });

        return NextResponse.json(tasks, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: `Topic ID error: ${error.message}` }, { status: 404 });
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();

        const task: Task = body;

        const newTask = await prisma.task.create({
            data: {
                topicID: task.topicID,
                description: task.description,
                problem: task.problem,
                solution: task.solution,
                type: AnswerType.TYPE,
                answer: task.answer,
            }
        })

        return NextResponse.json(newTask, { status: 201 });
    }
    catch (error) {
        return NextResponse.json(`Wrong task parameters: ${error.message}`, { status: 400 });
    }
}