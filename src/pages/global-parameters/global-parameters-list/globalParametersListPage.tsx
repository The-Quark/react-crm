import { Container } from '@/components/container';
import { GlobalParametersListContent } from '@/pages/global-parameters/global-parameters-list/components/globalParametersListContent.tsx';
import { SharedHeader } from '@/partials/sharedUI';

export const GlobalParametersListPage = () => {
  return (
    <>
      <SharedHeader />
      <Container>
        <GlobalParametersListContent />
      </Container>
    </>
  );
};
