import { Fragment, useEffect, useState } from 'react';
import { toAbsoluteUrl } from '@/utils/include/Assets.ts';
import { KeenIcon } from '@/components';
import { Container } from '@/components/container';
import { UserProfileHero } from '@/partials/heros';
import { Navbar, NavbarActions, NavbarDropdown } from '@/partials/navbar';
import { PageMenu } from '@/pages/public-profile';
import { getMemberById } from '@/api';
import { useParams } from 'react-router';
import { UserModel } from '@/api/getMemberById/types.ts';
import { CircularProgress } from '@mui/material';

const STORAGE_AVATAR_URL = import.meta.env.VITE_APP_STORAGE_AVATAR_URL;

export const MemberPublicProfilePage = () => {
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
        console.error('User request error: ', err);
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

  const image = (
    <img
      src={
        user ? `${STORAGE_AVATAR_URL}/${user.avatar}` : toAbsoluteUrl('/media/avatars/blank.png')
      }
      className="rounded-full border-3 border-success size-[100px] shrink-0"
    />
  );

  return (
    <Fragment>
      <UserProfileHero
        name={user ? user.name : 'Not Found'}
        image={image}
        info={[
          { email: user ? user.email : 'Not Found', icon: 'sms' },
          {
            label: user?.roles?.[0]?.nicename ?? user?.roles?.[0]?.name ?? 'Not Found',
            icon: 'user'
          }
        ]}
      />

      <Container>
        <Navbar>
          <PageMenu />

          <NavbarActions>
            <button type="button" className="btn btn-sm btn-primary">
              <KeenIcon icon="users" /> Connect
            </button>
            <button className="btn btn-sm btn-icon btn-light">
              <KeenIcon icon="messages" />
            </button>
            <NavbarDropdown />
          </NavbarActions>
        </Navbar>
      </Container>

      <Container>Test</Container>
    </Fragment>
  );
};
