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
        const body = await request.json();

        if (!body.parentID) throw new Error("Require parentID");
        if (!body.title) throw new Error("Require title");

        const topic: Topic = body;

        const newTopic = await prisma.topic.create({ data: topic });

        return NextResponse.json(newTopic, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ error: `Wrong topics creating params: ${error.message}` }, { status: 400 });
    }
}
