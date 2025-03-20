import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // Adjust path to your Prisma client

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const callbackUrl = searchParams.get("callbackUrl");

    if (!token) {
        return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    try {
        // Placeholder: Find user by verificationToken (schema update needed)
        const user = await prisma.user.findFirst({
            where: { verificationToken: token },
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        // Placeholder: Update emailVerified and clear verificationToken (schema update needed)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null,
            },
        });

        // Include callbackUrl in the redirect
        const redirectUrl = new URL("/register", request.url);
        redirectUrl.searchParams.set("verified", "true");
        if (callbackUrl) {
            redirectUrl.searchParams.set("callbackUrl", callbackUrl);
        }
        return NextResponse.redirect(redirectUrl);

        // Redirect to registerOrLogin with success message
        // return NextResponse.redirect(new URL("/register?verified=true", request.url));
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to verify email" }, { status: 500 });
    }
}