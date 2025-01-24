import { Plan } from "@prisma/client";
import { prisma } from "../../../lib/db";
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const plans = await prisma.plan.findMany();
        return NextResponse.json(plans, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: `Prisma error: ${error.message}` }, { status: 503 });
    }
};


export async function POST(request: Request) {
    try {
        const { userID, hours, endDate } = await request.json();
        const newPlan: Plan = {} as Plan;
        if (!userID) {
            return NextResponse.json({ error: `Plan error: required userID and none is provided` }, { status: 503 });
        }
        newPlan.userID = userID;
        if (hours) newPlan.hours = hours;
        if (endDate) newPlan.endDate = endDate;

        const plan = await prisma.plan.create({ data: newPlan });
        return NextResponse.json(plan, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: `Prisma error: ${error.message}` }, { status: 503 });
    }
};