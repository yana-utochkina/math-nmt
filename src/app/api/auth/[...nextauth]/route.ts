import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
console.log("NextAuth configuration is being loaded...");

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";


export const authOptions = {

    providers: [
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID!,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        // }),

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email"},
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {

                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Потрібна електронна адреса та пароль");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error("Юзер не знайдений");
                }

                if (!user.emailVerified) {
                    throw new Error('Підтвердьте свою електронну адресу перед входом');
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) {
                    throw new Error("Неправильний пароль");
                }

                return { id: user.id, email: user.email };
            },

        }),
    ],
    session: {
        strategy: "jwt" as const, // Use JWT for session management
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.email = token.email;
            return session;
        },
    },
    pages: {
        signIn: "/register", // Redirect to your login page
    },


    debug: true,
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };