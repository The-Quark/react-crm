import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getMemberById, getRoles, useCurrentUser } from '@/api';
import { CircularProgress } from '@mui/material';
import { UserModel } from '@/api/getMemberById/types.ts';
import { MemberRoleUpdatePageContentForm } from '@/pages/crm/member-role-update/components/blocks/memberRoleUpdatePageContentForm.tsx';
import { RolePermissionsResponse } from '@/api/getRoles/types.ts';

const MemberRoleUpdatePageContent = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserModel | null>(null);
  const [roles, setRoles] = useState<RolePermissionsResponse>();
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, roleData] = await Promise.all([
          getMemberById(Number(id)),
          getRoles(currentUser ? Number(currentUser.id) : 0, true)
        ]);
        setUser(userData);
        setRoles(roleData);
      } catch (err) {
        console.error('Ошибка получения данных пользователя или ролей:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="card flex justify-center items-center p-5">
        <CircularProgress />
      </div>
    );
  }

  if (!user || !roles) {
    return (
      <div className="card flex justify-center items-center p-5 text-danger">
        Пользователь не найден или произошла ошибка загрузки данных.
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <MemberRoleUpdatePageContentForm
        title="Update Member Role"
        user={user}
        roles={roles.result}
      />
    </div>
  );
};

export { MemberRoleUpdatePageContent };
