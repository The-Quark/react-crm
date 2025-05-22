export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  description: string | null;
  nicename: string | null;
  user_has: boolean;
  role_has: boolean;
  nice_name: string;
}

interface PermissionsResult {
  give: Permission[];
  revoke: Permission[];
}

export interface IPermissionsMapResponse {
  result: PermissionsResult;
}
