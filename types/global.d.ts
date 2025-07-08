/* eslint-disable @typescript-eslint/no-explicit-any */

type DynamicStringObject = {
  [key: string]: string;
};


declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      role: UserRole;
    }
  }
  // interface User {
  //   github_access_token?: string;
  // }
  interface JWT {
    name: string,
    email: string,
    userId: number,
    role: UserRole,
  }
}

export type session = Session | null;


export type UserRole = 'user | admin';

export interface User {
  id: number,
  email: string,
  name: string,
  password?: string,
  role?: UserRole,
  createdAt?: any,
}

export interface Map {
  id: number,
  title: string,
  formula: string,
  nodes?: any,
  edges?: any,
  createdAt: any,
  updatedAt: any,
  userId: number,
  isNew?: boolean,
}

export interface NodeTemplate {
  id: number,
  title: string,
  category: string,
  nodes?: Node[],
  edges?: Edge[],
}

export interface IFunnelBlock {
  id: string;
  title: string;
  order: number;
}


import { TextFieldProps } from '@mui/material/TextField';
import { Edge, Node } from '@xyflow/react';

declare module '@mui/material/TextField' {
  interface TextFieldPropsSizeOverrides extends TextFieldProps {
    mediumSmall: true;
  }
}