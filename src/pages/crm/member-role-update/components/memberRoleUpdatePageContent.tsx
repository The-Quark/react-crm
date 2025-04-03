import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getMemberById } from '@/api';
import { CircularProgress } from '@mui/material';
import { UserModel } from '@/api/getMemberById/types.ts';
import { MemberRoleUpdatePageContentForm } from '@/pages/crm/member-role-update/components/blocks/memberRoleUpdatePageContentForm.tsx';

const MemberRoleUpdatePageContent = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserModel | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getMemberById(Number(id));
        setUser(userData);
      } catch (err) {
        console.error('Ошибка получения данных пользователя:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="card flex justify-center items-center p-5">
        <CircularProgress />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card flex justify-center items-center p-5 text-danger">
        Пользователь не найден или произошла ошибка загрузки данных.
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <MemberRoleUpdatePageContentForm title="Update Member Role" user={user} />
    </div>
  );
};

export { MemberRoleUpdatePageContent };
