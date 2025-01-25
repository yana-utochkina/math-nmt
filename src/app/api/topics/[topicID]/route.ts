import { Topic } from "@prisma/client";
import { prisma } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: { topicID: string } }) {
    try {
        const { params } = await context;
        const { topicID } = await params;
        const topic = await prisma.topic.findUniqueOrThrow({
            where: {
                id: topicID,
            }
        });
        return NextResponse.json(topic, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: `Topic ID error: ${error.message}` }, { status: 404 });
    }
}

export async function PUT(request: Request, context: { params: { topicID: string } }) {
    try {
        const { params } = await context;
        const { topicID } = await params;

        const { searchParams } = new URL(request.url);
        const parentID = searchParams.get("parentID");
        const title = searchParams.get("title");

        const topic: Topic = {} as Topic;

        if (!parentID) throw new Error("Require parentID for topic");
        if (!title) throw new Error("Require title for topic");
        topic.parentID = parentID;
        topic.title = title;

        const updatedTopic = await prisma.topic.update({
            where: {
                id: topicID,
            },
            data: topic,
        });

        return NextResponse.json(updatedTopic, { status: 200 })
    }
    catch (error) {
        return NextResponse.json({ error: `Topic error: ${error.message}` }, { status: 501 });
    }
}

export async function DELETE(request: Request, context: { params: { topicID: string } }) {
    try {
        const { params } = context;
        const { topicID } = params;

        const deletedTopic = await prisma.topic.delete({
            where: {
                id: topicID,
            },
        });

        return NextResponse.json(deletedTopic, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: `Topic delete error: ${error.message}` }, { status: 400 });
    }
}