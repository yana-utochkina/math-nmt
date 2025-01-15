// Create-запит на створення плану (в параметрах hours : int, endDate : DateType????)
// Create-запит на створення плану (в параметрах hours : int, endDate : DateType????)
"use server";
import { Plan } from "@prisma/client";
import { prisma } from "../../../lib/db";
import { NextResponse } from "next/server"

// export const GET = async () => {
//     try {
//         const plans = await prisma.plan.findMany();
//         return new NextResponse(JSON.stringify(plans), { status: 200 });
//     }
//     catch (error: any) {
//         return new NextResponse("Error in users" + error.message, { status: 500 });
//     }
// };

export const GET = async () => {
    try {

        const plans = await prisma.plan.findMany();
        return NextResponse.json(plans, { status: 200 });
    }
    catch (error: any) {
        return NextResponse.json({ error: `Prisma error: ${error.message}` }, { status: 503 });
    }
};


export const POST = async (request: Request) => {
    try {
        const { userID, hours, endDate } = await request.json();
        const newPlan: Plan = {} as Plan;
        if (!userID) {
            return NextResponse.json({ error: `Plans error: required user ID and none is provided` }, { status: 503 });
        }
        newPlan.userID = userID;
        if (hours) newPlan.hours = hours;
        if (endDate) newPlan.endDate = endDate;


        const plan = await prisma.plan.create({ data: newPlan });
        return NextResponse.json(plan, { status: 200 });
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
