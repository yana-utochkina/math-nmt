"use client";

import { signIn } from "next-auth/react";

const SignIn = () => {
    return (
        <div>
            <h1>Sign In</h1>
            {/* Default NextAuth sign-in button */}
            <button
                onClick={() => signIn("google")}
                className="btn btn-google" // Optional: Add styling classes like bootstrap's 'btn-google' if you want
            >
                Sign in with Google
            </button>
        </div>
    );
};

export default SignIn;