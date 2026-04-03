import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation/auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
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

        if (account.memb__pwd !== validatedCredentials.data.password) {
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
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
