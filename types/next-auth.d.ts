// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";
import { UserRole } from "./global";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      name: string | null;
      role: UserRole;
    };
  }

  interface User {
    id: number;
    email: string;
    name?: string | null;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: number;
    role: UserRole;
  }
}