import { loginSchema } from "@/lib/validation/login";
import { verifyPassword } from "@/lib/auth/password";
import { refreshSessionToken } from "@/lib/auth/session-token";
import { getAccountPasswordStamp } from "@/lib/queries/get-account-password-stamp";
import { prisma } from "@/prisma/prisma";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const isTrustedHost =
  process.env.NODE_ENV !== "production" ||
  process.env.AUTH_TRUST_HOST === "true" ||
  process.env.AUTH_TRUST_HOST === "1";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: isTrustedHost,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validatedCredentials = loginSchema.safeParse({
          username: credentials.username,
          password: credentials.password,
        });

        if (!validatedCredentials.success) {
          return null;
        }

        const account = await prisma.mEMB_INFO.findUnique({
          where: { memb___id: validatedCredentials.data.username },
        });

        if (!account) {
          return null;
        }

        if (
          !verifyPassword({
            password: validatedCredentials.data.password,
            account: {
              username: account.memb___id,
              password: account.memb__pwd,
            },
          })
        ) {
          return null;
        }

        return {
          id: account.memb___id,
          name: account.memb_name,
          email: account.mail_addr ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    // A new password (the reset link or the account page) ends every session made with the old one.
    // proxy.ts checks the same.
    jwt: ({ token, user }) =>
      refreshSessionToken(token, user?.id, getAccountPasswordStamp),
    session: async ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
