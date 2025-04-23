import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // Adjust path

export async function POST(request: Request) {
    const { email } = await request.json();

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Placeholder: Check emailVerified (schema update needed)
    return NextResponse.json({ emailVerified: user.emailVerified || false });
}