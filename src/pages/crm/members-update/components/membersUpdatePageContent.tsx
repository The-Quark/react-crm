import { MembersUpdatePageContentUserForm } from '@/pages/crm/members-update/components/blocks/membersUpdatePageContentUserForm.tsx';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getUser } from './membersUpdatePageGetUser';
import { CircularProgress } from '@mui/material';
import { UserModel } from './types.ts';

const MembersUpdatePageContent = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserModel | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUser(Number(id));
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
      <MembersUpdatePageContentUserForm title="Update User" user={user} />
    </div>
  );
};

export { MembersUpdatePageContent };
