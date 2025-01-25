import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { Topic } from "@prisma/client";

export async function GET() {
    try {
        const topics = await prisma.topic.findMany();
        return NextResponse.json(topics, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: `Prisma error: ${error.message}` }, { status: 503 });
    }
}

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const topic: Topic = {} as Topic;

        topic.parentID = searchParams.get("parentID");
        topic.title = searchParams.get("title");

        const newTopic = await prisma.topic.create({ data: topic });

        return NextResponse.json(newTopic, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ error: `Wrong topics creating params: ${error.message}` }, { status: 400 });
    }
}
