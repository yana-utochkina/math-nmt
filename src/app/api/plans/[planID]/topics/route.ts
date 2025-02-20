import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request, context: { params: { planID: string } }) {
    try {
        const { params } = await context;
        const { planID } = await params;

        const { userID } = await prisma.plan.findUniqueOrThrow({
            where: {
                id: planID
            },
            select: {
                userID: true
            }
        });

export const GET = async (request: Request, contex: any) => {
    try {
        const { params } = contex;
        const planid = params.planID;
        const topics = await prisma.planTask.findMany({
            where: {
                planID: planid
            },
            include: {
                task: {
                    select: {
                        topic: {
                            select: {
                                id: true,
                                parentID: true,
                                title: true,
                            }
                        }
                    }
                }
            }
        });


//         const groupedTopics = topics.reduce((acc: any, topic: any) => {
//             const { id, title, parentID } = topic.task.topic;
//             if (!acc[title]) {
//                 acc[title] = { id, parentID, topics: [] };
//             }
//             acc[title].topics.push({ ...topic, task: { ...topic.task, topic: undefined } });
//             return acc;
//         }, {});

        return NextResponse.json(userID, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: `Topics error: ${error.message}` }, { status: 500 });
    }
}

        return NextResponse.json(groupedTopics, { status: 200 });
    }
    catch (error: any) {
        return NextResponse.json({ error: `Prisma error: ${error.message}` }, { status: 503 });
    }
};

export const POST = async (request: Request, contex: any) => {
    try {
        const { params } = contex;
        const planid = params.planID;
        const { title } = await request.json();
        const topic = await prisma.topic.create
            ({
                data: {
                    title: title,
                    parentID: planid
                }
            });
        return NextResponse.json(topic, { status: 200 });
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