/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultSession, DefaultUser } from "next-auth";

export type UserRole = 'user' | 'admin';

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number;
      name: string;
      email: string;
      role: UserRole;
    }
  }

  interface JWT {
    name: string;
    email: string;
    userId: number;
    role: UserRole;
  }
}

export type SessionOrNull = Session | null;
