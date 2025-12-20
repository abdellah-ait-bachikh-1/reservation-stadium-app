import db from "@/lib/db";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
export const authConfig: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        console.log({user})
        if (!user || user?.deletedAt !== null) {
          return null;
        }
        const validPassword = await compare(
          credentials.password,
          user.password
        );
        if (!validPassword) {
          return null;
        }
        const { id , email, role ,fullNameAr,fullNameFr,phoneNumber,deletedAt} = user;
        return { id , email, role ,fullNameAr,fullNameFr,phoneNumber,deletedAt };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "auth/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
      token.id = user.id;
      token.email = user.email;
      token.role = user.role;
      token.fullNameAr = user.fullNameAr;
      token.fullNameFr = user.fullNameFr;
      token.phoneNumber = user.phoneNumber;
    }
      return token;
    },
    async session({ session, token }) {
      session.user = {
      id: token.id as string,
      email: token.email as string,
      role: token.role as string,
      fullNameAr: token.fullNameAr as string,
      fullNameFr: token.fullNameFr as string,
      phoneNumber: token.phoneNumber as string,
    };
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
