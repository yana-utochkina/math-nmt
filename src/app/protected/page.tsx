"use client";

import { useSession, signIn } from "next-auth/react";

export default function ProtectedPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (!session) {
        // If not logged in, redirect to sign in
        signIn("google");
        return <p>Redirecting to login...</p>;
    }

    return (
        <div>
            <h1>Protected Page</h1>
            <p>Welcome, {session.user?.name}!</p>
            {/* You can place any protected content here */}
        </div>
    );
}
