import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    // adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: '/login', // This is your custom login page (optional)
        error: '/auth/error',   // Optional: an error page when authentication fails
    },

    callbacks: {
        async redirect({ url, baseUrl }) {
            // You can redirect to a specific page after successful login
            if (url === '/login') {
                return baseUrl;  // Redirect to home page or the desired route
            }
            return url;
        },

        // async session({ session, user }) {
        //     session.user.id = user.id; // Додаємо ID користувача до сесії
        //     return session;
        // },
    }
});

export { handler as GET, handler as POST };