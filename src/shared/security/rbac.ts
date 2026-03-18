export type Role = 'ADMIN' | 'TECH' | 'CLIENT' | string;

const roleHierarchy: Record<string, number> = {
  ADMIN: 3,
  TECH: 2,
  CLIENT: 1,
};

export function hasRole(userRole: Role | undefined, requiredRole: Role): boolean {
  if (!userRole) return false;
  const requiredLevel = roleHierarchy[requiredRole as string] ?? 0;
  return (roleHierarchy[userRole as string] ?? 0) >= requiredLevel;
}

export function requireRole(requiredRole: Role) {
  return (userRole: Role | undefined): boolean => hasRole(userRole, requiredRole);
}

export const requireAdmin = requireRole('ADMIN');
export const requireTech = requireRole('TECH');
export const requireClient = requireRole('CLIENT');
