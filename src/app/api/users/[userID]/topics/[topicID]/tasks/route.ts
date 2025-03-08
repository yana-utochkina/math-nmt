import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: { userID, topicID } }) {
    const { params } = await context;
    const { userID, topicID } = await params;

    const tasks = await prisma.task.findMany({
        where: {
            topicID: '721eea05-073b-45ea-8239-6459bddc6b0d',
        },
        include: {
            UserTask: {
                where: {
                    userID: '4a57e5ff-28b2-4489-8a5b-49b3162ffb15',
                }
            }
        }
    });

    return NextResponse.json(tasks, { status: 200 });
}