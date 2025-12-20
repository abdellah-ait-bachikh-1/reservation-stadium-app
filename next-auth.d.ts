import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      fullNameAr: string;
      fullNameFr: string;
      phoneNumber: string;
    };
  }

  interface User {
    id: string;
    email: string;
    role: string;
    fullNameAr: string;
    fullNameFr: string;
    phoneNumber: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: string;
    fullNameAr: string;
    fullNameFr: string;
    phoneNumber: string;
  }
}
