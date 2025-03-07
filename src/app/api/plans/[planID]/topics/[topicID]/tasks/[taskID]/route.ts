import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(request: Request, context: { params: { planID: string, topicID: string, taskID: string } }) {
    try {
        const { params } = context;
        const planID = await params.planID;
        const taskID = await params.taskID;

        const deletedPlanTask = await prisma.planTask.delete({
            where: {
                planID_taskID: {
                    planID: planID,
                    taskID: taskID,
                }
            },
        });
        return NextResponse.json(deletedPlanTask, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: `TaskID error: ${error.message}` }, { status: 503 });
    }
}
