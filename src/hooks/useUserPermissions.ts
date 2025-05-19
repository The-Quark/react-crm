import { useMemo } from 'react';
import { useAuthContext } from '@/auth';

export const useUserPermissions = () => {
  const { currentUser } = useAuthContext();
  const permissions: string[] = currentUser.permissions.map((p) => p.name) || [];

  const hasPermission = (perm: string | string[]): boolean => {
    if (Array.isArray(perm)) {
      return perm.some((p) => permissions.includes(p));
    }
    return permissions.includes(perm);
  };

  return useMemo(
    () => ({
      list: permissions,
      has: hasPermission
    }),
    [permissions.join(',')]
  );
};
