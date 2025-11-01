// types/api.ts
export interface ApiResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    hasMore: boolean;
  };
}

export interface SuperTemplate {
  id: number;
  title: string;
  category?: string;
  nodes?: string | null;
  edges?: string | null;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number;
  user?: {
    id: number;
    name?: string | null;
    email: string;
  };
}