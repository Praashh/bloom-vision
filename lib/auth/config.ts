import type { DefaultSession, NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
            name: string;
            email: string;
            image: string;
            credits: number
        } & DefaultSession['user'];
    }
    interface User {
        credit?: number
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        credits?: number
    }
}

export const authConfig = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.image = user.image;
                token.credits = user.credit
            }
            if (!token.sub) return token;
            const existingUser = await prisma.user.findUnique({
                where: {
                    id: token.sub,
                },
            });
            if (existingUser) {
                token.image = existingUser.image;
                token.credits = existingUser.credit;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.image = token.image as string;
                session.user.credit = token.credits as number;
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
    trustHost: true,
    events: {
        createUser: async ({ user }) => {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: new Date(),
                },
            });
        },
    },
} satisfies NextAuthConfig;