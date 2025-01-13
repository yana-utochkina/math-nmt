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

