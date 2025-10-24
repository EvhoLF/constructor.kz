import { UserRole } from './auth';

export interface User {
  id: number;
  email: string;
  name: string;
  password?: string;
  role?: UserRole;
  createdAt?: any;
}
