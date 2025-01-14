import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET() {
    try {
        const topics = await prisma.topic.findMany();
        return NextResponse.json(topics, { status: 200 });
    }
    catch (error) {
        return NextResponse.json(`Prisma error: ${error.message}`, { status: 503 });
    }
}

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const parentID = searchParams.get("parentID");
        const title = searchParams.get("title");

        const topic = await prisma.topic.create({
            data: {
                parentID,
                title,
            },
        });
        return NextResponse.json(topic, { status: 201 });
    }
    catch (error) {
        return NextResponse.json(`Wrong topics creating params: ${error.message}`, { status: 400 });
    }
}

export async function PATCH() {
    return new NextResponse(`Not implemented error`, { status: 501 });
}

export async function DELETE() {
    return new NextResponse(`Not implemented error`, { status: 501 });
}