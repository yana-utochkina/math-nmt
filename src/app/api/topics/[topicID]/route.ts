import { Topic } from "@prisma/client";
import { prisma } from "@db";
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

        const body = await request.json();

        if (!body.parentID) throw new Error("Require parentID");
        if (!body.title) throw new Error("Require title");

        const topic: Topic = body;

        const updatedTopic = await prisma.topic.update({
            where: {
                id: topicID,
            },
            data: topic,
        });

        return NextResponse.json(updatedTopic, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: `Topic error: ${error.message}` }, { status: 501 });
    }
}

export async function PATCH(request: Request, context: { params: { topicID: string } }) {
    try {
        const { params } = await context;
        const { topicID } = await params;

        const body = await request.json();

        const topic: Topic = body;

        const updatedTopic = await prisma.topic.update({
            where: {
                id: topicID,
            },
            data: topic,
        });

        return NextResponse.json(updatedTopic, { status: 200 });
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