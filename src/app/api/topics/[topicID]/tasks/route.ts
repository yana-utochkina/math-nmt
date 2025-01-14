// Read-запит на діставання всіх id завданнь з конкретної теми

import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";

export async function GET(request: Request, context: any) {
    try {
        const { params } = context;

        const tasks = await prisma.task.findMany({
            where: {
                topicID: params.topicID,
            },
        });

        return NextResponse.json(tasks, { status: 200 });
    }
    catch (error) {
        return NextResponse.json(`Topic ID error: ${error.message}`, { status: 404 });
    }
}


export async function POST(request: Request) {
    try{
        const body = await request.json();

        const {topicID, description, problem, solution, type, answer} = body;


        const newTask = await prisma.task.create({
            data: {
                topicID: topicID,
                description: description,
                problem: problem,
                solution: solution,
                type: type,
                answer: answer,
            }
        })

        return NextResponse.json(newTask, { status: 201 });
    }
    catch (error) {
        return NextResponse.json(`Wrong task parameters: ${error.message}`, { status: 400 });
    }
}