import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { email, token, callbackUrl } = await request.json();

        const callbackParam = callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : "";

        if (!email || !token) {
            return NextResponse.json({ error: 'Email and token are required' }, { status: 400 });
        }

        const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify_email?token=${token}${callbackParam}`;
        await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Верифікуйте свій емейл для Kitacademy',
            html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
        });

        return NextResponse.json({ message: 'Verification email sent' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}