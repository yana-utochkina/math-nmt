import {prisma} from "../../../../../../lib/db";
import {NextResponse} from "next/server";
import {AnswerType} from "@prisma/client";

export async function GET(req: Request, context: any) {
    try{
        const { params } = context;

        const taskID = params.taskID;
        const topicID = params.topicID;


        const task = await prisma.task.findUniqueOrThrow({
            where: {
                id: taskID,
                topicID: topicID
            }
        });
        return NextResponse.json(task, { status: 200 });
    }
    catch (error){
        return new NextResponse(`Wrong topic ID or task ID error: ${error.message}`, { status: 404 });
    }
}


export async function POST() {
    return new NextResponse(`Not implemented error`, { status: 501 });
}

export async function PUT(request: Request, context: any) {
    try{
        const { params } = context;
        const body = await request.json();

        const {topicID, description, problem, solution, type, answer} = body;

        const updatedData: {
            topicID?: string,
            description?: string,
            problem?: string,
            solution?: string,
            type?: AnswerType,
            answer?: string,
        } = {};

        if(topicID) updatedData.topicID = topicID;
        if(description) updatedData.description = description;
        if(problem) updatedData.problem = problem;
        if(solution) updatedData.solution = solution;
        if(type) updatedData.type = type;
        if(answer) updatedData.answer = answer;

        const updatedTask = await prisma.task.update({
            where: {
                id: params.taskID,
                topicID: params.topicID
            },
            data: updatedData,
        });

        return NextResponse.json(updatedTask, { status: 200 });
    }
    catch(error){
        return NextResponse.json(`Update Task error: ${error.message}`, { status: 404 });
    }
}

export async function DELETE(request: Request, context: any){
    try{
        const { params } = context;

        const deletedTask = await prisma.task.delete({
            where: {
                id: params.taskID,
                topicID: params.topicID
            },
        });

        return NextResponse.json(deletedTask, { status: 200 });
    }
    catch (error) {
        return new NextResponse(`Delete Task error: ${error.message}`, { status: 404 });
    }
}