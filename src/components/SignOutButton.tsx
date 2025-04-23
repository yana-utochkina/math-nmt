"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
    return (
        <button
            className="text-primary border-0 bg-transparent p-0 underline"
            onClick={() => signOut({ callbackUrl: "/" })}
        >
            Вийти
        </button>
    );
}