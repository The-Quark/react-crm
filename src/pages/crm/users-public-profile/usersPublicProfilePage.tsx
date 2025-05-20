import { Fragment } from 'react';
import { toAbsoluteUrl } from '@/utils/include/Assets.ts';
import { KeenIcon } from '@/components';
import { Container } from '@/components/container';
import { UserProfileHero } from '@/partials/heros';
import { Navbar, NavbarActions, NavbarDropdown } from '@/partials/navbar';
import { PageMenu } from '@/pages/public-profile';
import { getUsers } from '@/api/get';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

const STORAGE_AVATAR_URL = import.meta.env.VITE_APP_STORAGE_AVATAR_URL;

export const UsersPublicProfilePage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users-id'],
    queryFn: () => getUsers({ id: id ? Number(id) : undefined }),
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    refetchIntervalInBackground: true,
    enabled: !!id
  });

  if (isLoading) {
    return <SharedLoading />;
  }

  if (!data || isError) {
    return <SharedError error={error} />;
  }

  const image = (
    <img
      src={
        data.result.avatar
          ? `${STORAGE_AVATAR_URL}/${data.result.avatar}`
          : toAbsoluteUrl('/media/avatars/blank.png')
      }
      className="rounded-full border-3 border-success size-[100px] shrink-0"
    />
  );

  return (
    <Fragment>
      <UserProfileHero
        name={data.result ? `${data.result.first_name}` : 'Not Found'}
        image={image}
        info={[
          { email: data.result ? data.result.email : 'Not Found', icon: 'sms' },
          {
            label:
              data.result?.roles?.[0]?.nicename ?? data.result?.roles?.[0]?.name ?? 'Not Found',
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
