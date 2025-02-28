import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
// import bcrypt from "bcrypt";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";


export const authOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {

                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error("User not found");
                }

                // const isValid = await bcrypt.compare(credentials.password, user.password);
                const isValid = (credentials.password == user.password);
                if (!isValid) {
                    throw new Error("Incorrect password");
                }

                return { id: user.id, email: user.email };
            },
        }),
    ],

    pages: {
        signIn: "/register", // Redirect to your login page
    },



    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


// callbacks: {
//     async session({ session, token }) {
//         session.user.id = token.id;
//         return session;
//     },
// },

// async redirect({ url, baseUrl }) {
//     // You can redirect to a specific page after successful login
//     if (url === '/login') {
//         return baseUrl;  // Redirect to home page or the desired route
//     }
//     return url;
// },