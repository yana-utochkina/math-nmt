// Read-запит на діставання json {title, progress(групувати по темі в таблиці UserTopicTask)}

import { prisma } from "../../../../../lib/db";
import { NextResponse } from "next/server"


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
                    include: {
                        topic: {
                            select: {
                                parentID: true,
                                title: true
                            }
                        }
                    }
                }
            }
        });
        return NextResponse.json(topics, { status: 200 });
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
// export const GET = async (request: Request) => {
//     try {
//         const { id, title, progress } = await request.json();
//         const tasks = await prisma.task.findMany({
//             where: {
//                 id: id
//             },
//             select: {
//                 title: true,
//                 progress: {
//                     select: {
//                         topicID: true,
//                         progress: true
//                     }
//                 }
//             }
//         });

//         return NextResponse.json(tasks);
//     }
//     catch (error: any) {
//         console.error("Error fetching plans:", error);
//         return NextResponse.json(
//             { error: "An error occurred while fetching plans" },
//             { status: 500 }
//         );
//     }

// }
