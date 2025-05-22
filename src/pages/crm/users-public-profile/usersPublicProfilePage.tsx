import { Fragment } from 'react';
import { toAbsoluteUrl } from '@/utils/include/Assets.ts';
import { Container } from '@/components/container';
import { UserProfileHero } from '@/partials/heros';
import { getUserByParams } from '@/api/get';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { UsersPublicProfileGeneralInfo } from '@/pages/crm/users-public-profile/components/usersPublicProfileGeneralInfo.tsx';
import { UsersPublicProfileACL } from '@/pages/crm/users-public-profile/components/usersPublicProfileACL.tsx';

const STORAGE_AVATAR_URL = import.meta.env.VITE_APP_STORAGE_AVATAR_URL;

export const UsersPublicProfilePage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users-id'],
    queryFn: () => getUserByParams({ id: id ? Number(id) : undefined }),
    retry: false,
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
        data.result[0].avatar
          ? `${STORAGE_AVATAR_URL}/${data.result[0].avatar}`
          : toAbsoluteUrl('/media/avatars/blank.png')
      }
      className="rounded-full border-3 border-success size-[100px] shrink-0"
    />
  );

  return (
    <Fragment>
      <UserProfileHero
        name={data.result[0] ? `${data.result[0].first_name}` : 'Not Found'}
        image={image}
        info={[
          { email: data.result[0] ? data.result[0].email : 'Not Found', icon: 'sms' },
          {
            label:
              data.result[0]?.roles?.[0]?.nicename ??
              data.result[0]?.roles?.[0]?.name ??
              'Not Found',
            icon: 'user'
          }
        ]}
      />

      {/*<Container>*/}
      {/*  <Navbar>*/}
      {/*    <PageMenu />*/}
      {/*    <NavbarActions>*/}
      {/*      <button type="button" className="btn btn-sm btn-primary">*/}
      {/*        <KeenIcon icon="users" /> Connect*/}
      {/*      </button>*/}
      {/*      <button className="btn btn-sm btn-icon btn-light">*/}
      {/*        <KeenIcon icon="messages" />*/}
      {/*      </button>*/}
      {/*      <NavbarDropdown />*/}
      {/*    </NavbarActions>*/}
      {/*  </Navbar>*/}
      {/*</Container>*/}

      <Container>
        <div className="flex flex-col gap-5 ">
          <UsersPublicProfileGeneralInfo
            data={{
              ...data.result[0],
              gender: data.result[0]?.gender ?? undefined,
              phone: data.result[0]?.phone ?? undefined,
              location: data.result[0]?.location ?? undefined,
              company: data.result[0]?.company ?? undefined,
              department: data.result[0]?.department ?? undefined,
              subdivision: data.result[0]?.subdivision ?? undefined,
              position: data.result[0]?.position ?? undefined
            }}
          />
          <UsersPublicProfileACL
            roles={data.result[0]?.roles || []}
            permissions={data.result[0]?.roles[0].permissions || []}
          />
        </div>
      </Container>
    </Fragment>
  );
};
