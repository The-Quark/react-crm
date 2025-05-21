import { Fragment } from 'react';
import { toAbsoluteUrl } from '@/utils/include/Assets.ts';
import { KeenIcon } from '@/components';
import { Container } from '@/components/container';
import { UserProfileHero } from '@/partials/heros';
import { Navbar, NavbarActions, NavbarDropdown } from '@/partials/navbar';
import { PageMenu } from '@/pages/public-profile';
import { ProfilePageContent } from './components/profilePageContent';
import { useCurrentUser } from '@/api/get';

const STORAGE_AVATAR_URL = import.meta.env.VITE_APP_STORAGE_AVATAR_URL;

export const ProfilePage = () => {
  const { data: currentUser } = useCurrentUser();
  const image = (
    <img
      src={
        currentUser?.avatar
          ? `${STORAGE_AVATAR_URL}/${currentUser.avatar}`
          : toAbsoluteUrl('/media/avatars/blank.png')
      }
      className="rounded-full border-3 border-success size-[100px] shrink-0"
    />
  );

  return (
    <Fragment>
      <UserProfileHero
        name={
          currentUser
            ? `${currentUser.first_name} ${currentUser.last_name} ${currentUser.patronymic}`
            : 'Not Found'
        }
        image={image}
        info={[
          { email: currentUser ? currentUser.email : 'Not Found', icon: 'sms' },
          {
            label: currentUser
              ? currentUser.roles?.[0]?.nicename
                ? currentUser.roles[0].nicename
                : `${currentUser.roles[0].name}`
              : 'Not Found',
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

      {/*<Container>*/}
      {/*  <ProfilePageContent />*/}
      {/*</Container>*/}
    </Fragment>
  );
};
