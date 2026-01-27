import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getUserByEmailForAuth, getUserByIdForAuth } from "./lib/queries/user";
import { AUTH_SECRET } from "./const";
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
        const user = await getUserByEmailForAuth(credentials.email);
        if (
          !user ||
          !user.isApproved ||
          user.emailVerifiedAt === null ||
          user?.deletedAt !== null
        ) {
          return null;
        }
        const validPassword = await compare(
          credentials.password,
          user.password
        );

        if (!validPassword) {
          return null;
        }

        const { id, name, email, role } = user;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          createdAt: user.createdAt,
          role: user.role,
          deletedAt: user.deletedAt,
          emailVerifiedAt: user.emailVerifiedAt,
          isApproved: user.isApproved,
          preferredLocale: user.preferredLocale,
          updatedAt: user.updatedAt,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7,
  },
  // cookies: {
  //   sessionToken: {
  //     name: `next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //     },
  //   },
  // },
  pages: { signIn: "/auth/login" },
    callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in - store ALL user data in token
      if (user) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          createdAt: user.createdAt,
          role: user.role,
          deletedAt: user.deletedAt,
          emailVerifiedAt: user.emailVerifiedAt,
          isApproved: user.isApproved,
          preferredLocale: user.preferredLocale,
          updatedAt: user.updatedAt,
        };
      }
      
      // On subsequent requests, validate user exists in DB
      if (token.id) {
        try {
          const dbUser = await getUserByIdForAuth(token.id);
          
          // Check if user is valid and active
          const isValidUser = dbUser && 
            dbUser.isApproved && 
            dbUser.emailVerifiedAt && 
            !dbUser.deletedAt;
          
          if (isValidUser) {
            // Return updated token with ALL latest safe data
            return {
              ...token,
              name: dbUser.name,
              email: dbUser.email,
              phoneNumber: dbUser.phoneNumber,
              createdAt: dbUser.createdAt,
              role: dbUser.role,
              deletedAt: dbUser.deletedAt,
              emailVerifiedAt: dbUser.emailVerifiedAt,
              isApproved: dbUser.isApproved,
              preferredLocale: dbUser.preferredLocale,
              updatedAt: dbUser.updatedAt,
            };
          } else {
            // User is invalid - mark as invalid
            return {
              ...token,
              isInvalid: true,
              exp: Math.floor(Date.now() / 1000) - 3600,
            };
          }
        } catch (error) {
          console.error("Error validating user in JWT:", error);
          return {
            ...token,
            isInvalid: true,
            exp: Math.floor(Date.now() / 1000) - 3600,
          };
        }
      }
      
      // Handle session updates
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // Check if token is invalid or expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (token.isInvalid || (token.exp && token.exp < currentTime)) {
        session.user = null;
        session.expires = new Date(0).toISOString();
        return session;
      }
      
      // Valid session - ensure all required fields exist
      if (token.id && token.name && token.email && token.role) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          phoneNumber: token.phoneNumber!,
          createdAt: token.createdAt!,
          role: token.role,
          deletedAt: token.deletedAt ?? null,
          emailVerifiedAt: token.emailVerifiedAt ?? null,
          isApproved: token.isApproved!,
          preferredLocale: token.preferredLocale!,
          updatedAt: token.updatedAt!,
        };
      } else {
        session.user = null;
        session.expires = new Date(0).toISOString();
      }
      
      return session;
    },
  },
  secret: AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
