// hooks/useCurrentUser.ts
import { useSession } from 'next-auth/react';

export const useCurrentUser = () => {
  const { data: session } = useSession();
  
  return {
    userId: session?.user?.id,
    isAuthenticated: !!session?.user,
    user: session?.user
  };
};