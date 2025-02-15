import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

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
