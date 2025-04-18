export interface Permission {
  id: number;
  name: string;
  nicename: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    role_id: number;
    permission_id: number;
  };
}

export interface RolePermissionsResponse {
  result: Permission[];
  count: number;
}
