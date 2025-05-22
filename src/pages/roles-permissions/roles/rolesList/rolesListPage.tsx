import { Container } from '@/components/container';
import { RolesListPageContent } from '@/pages/roles-permissions/roles/rolesList/components/rolesListPageContent.tsx';
import { SharedHeader } from '@/partials/sharedUI';

export const RolesListPage = () => {
  return (
    <>
      <SharedHeader />
      <Container>
        <RolesListPageContent />
      </Container>
    </>
  );
};
