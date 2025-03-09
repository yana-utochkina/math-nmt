import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { email, token } = await request.json();

        if (!email || !token) {
            return NextResponse.json({ error: 'Email and token are required' }, { status: 400 });
        }

        const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify_email?token=${token}`;
        await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Verify Your Email for NMT Prep',
            html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
        });

        return NextResponse.json({ message: 'Verification email sent' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}