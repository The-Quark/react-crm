interface Permission {
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

export interface Role {
  id: number;
  name: string;
  nicename: string;
  description: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  users_count: number;
  permissions: Permission[];
}

export interface RolePermissionsResponse {
  result: Role[];
  count: number;
}
