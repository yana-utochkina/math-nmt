// Create-запит на створення плану (в параметрах hours : int, endDate : DateType????)
"use server";
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

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            try {
                const plans = await prisma.plan.findMany();
                return new NextResponse(JSON.stringify(plans), { status: 200 });
            }
            catch (error: any) {
                return new NextResponse("Error in users" + error.message, { status: 500 });
            }
        }

        const plans = await prisma.plan.findUnique(
            {
                where: {
                    id: id
                }
            }
        );
        return new NextResponse(JSON.stringify(plans), { status: 200 });
    }
    catch (error: any) {
        return new NextResponse("Error in users" + error.message, { status: 500 });
    }
};


export const POST = async (request: Request) => {
    try {
        const { hours, endDate } = await request.json();
        const plan = await prisma.plan.create({
            data: {
                hours: hours,
                endDate: endDate
            }
        });
        return new NextResponse(JSON.stringify({ message: "Plan created", user: plan }), { status: 200 });
    }
    catch (error: any) {
        return new NextResponse("Error in creating plan" + error.message, { status: 500 });
    }
};

export const PATCH = async (request: Request) => {
    try {
        const { id, hours, endDate } = await request.json();
        const plan = await prisma.plan.update({
            where: {
                id: id
            },
            data: {
                hours: hours,
                endDate: endDate
            }
        });

        return new NextResponse(JSON.stringify(plan), { status: 200 });
    }
    catch (error: any) {
        return new NextResponse("Error in plans" + error.message, { status: 500 });
    }
}

export const DELETE = async (request: Request) => {
    try {
        const { id } = await request.json();
        const plan = await prisma.plan.delete({
            where: {
                id: id
            }
        });

        return new NextResponse(JSON.stringify(plan), { status: 200 });
    }
    catch (error: any) {
        return new NextResponse("Error in users" + error.message, { status: 500 });
    }
}