import { Fragment } from 'react';
import { Container } from '@/components/container';
import { RolesPageContent } from './components/rolesPageContent.tsx';
import { SharedHeader } from '@/partials/sharedUI';

export const RolesPage = () => {
  return (
    <Fragment>
      <SharedHeader />
      <Container>
        <RolesPageContent />
      </Container>
    </Fragment>
  );
};
