export type Role = 'admin' | 'user' | 'viewer' | string;

const roleHierarchy: Record<Role, number> = {
  admin: 3,
  user: 2,
  viewer: 1,
};

export function hasRole(userRoles: Role[] | undefined, requiredRole: Role): boolean {
  if (!userRoles?.length) return false;
  const requiredLevel = roleHierarchy[requiredRole] ?? 0;
  return userRoles.some((r) => (roleHierarchy[r] ?? 0) >= requiredLevel);
}

export function requireRole(requiredRole: Role) {
  return (userRoles: Role[] | undefined): boolean => hasRole(userRoles, requiredRole);
}

export const requireAdmin = requireRole('admin');
export const requireUser = requireRole('user');
export const requireViewer = requireRole('viewer');
