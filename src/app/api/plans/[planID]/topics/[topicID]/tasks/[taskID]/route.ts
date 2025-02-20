import { NextResponse } from "next/server";
import { prisma } from "../../../../../../../../lib/db";

export const GET = async (request: Request, context: any) => {
    try {
        const { params } = context;
        const taskID = params.taskID;
        const task = await prisma.task.findUnique({
            where: {
                id: taskID,
            },
        });
        return NextResponse.json(task, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: `TaskID error: ${error.message}` }, { status: 503 });
    }
}

export const PATCH = async (request: Request, context: any) => {
    try {
        const { params } = context;
        const taskID = params.taskID;
        const { description, problem, solution, type, answer } = await request.json();

        const task = await prisma.task.update({
            where: {
                id: taskID,
            },
            data: {
                description: description,
                problem: problem,
                solution: solution,
                type: type,
                answer: answer,
            },
        });
        return NextResponse.json(task, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: `TaskID error: ${error.message}` }, { status: 503 });
    }
}

export const DELETE = async (request: Request, context: any) => {
    try {
        const { params } = context;
        const taskID = params.taskID;

        await prisma.task.delete({
            where: {
                id: taskID,
            },
        });
        return NextResponse.json({ message: `Task with id ${taskID} deleted` }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: `TaskID error: ${error.message}` }, { status: 503 });
    }
}
