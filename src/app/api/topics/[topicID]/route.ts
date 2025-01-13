import { prisma } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: any) {
    try {
        const { params } = context;
        const topic = await prisma.topic.findUniqueOrThrow({
            where: {
                id: params.topicID,
            }
        });
        return NextResponse.json(topic, { status: 200 });
    }
    catch (error) {
        return NextResponse.json(`Topic ID error: ${error.message}`, { status: 404 });
    }
}

export async function POST() {
    return new NextResponse(`Not implemented error`, { status: 501 });
}

export async function PUT(request: Request, context: any) {
    try {
        const { params } = context;

        const { searchParams } = new URL(request.url);
        const parentID = searchParams.get("parentID");
        const title = searchParams.get("title");

        const updatedData: { parentID?: string; title?: string } = {};

        if (parentID) {
            updatedData.parentID = parentID;
        }
        if (title) {
            updatedData.title = title;
        }

        const updatedTopic = await prisma.topic.update({
            where: {
                id: params.topicID,
            },
            data: updatedData,
        });

        return NextResponse.json(updatedTopic, { status: 200 })
    }
    catch {
        return new NextResponse(`Wrong topic updating params`, { status: 501 }); // знайти код
    }
}

export async function DELETE(request: Request, context: any) {
    try {
        const { params } = context;

        const deletedTopic = await prisma.topic.delete({
            where: {
                id: params.topicID,
            },
        });

        return NextResponse.json(deletedTopic, { status: 200 });
    }
    catch (error) {
        return new NextResponse(`Topic ID error: ${error.message}`, { status: 404 });
    }
}