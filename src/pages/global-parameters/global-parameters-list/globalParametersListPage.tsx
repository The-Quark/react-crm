import { FC, Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { GlobalParametersListContent } from '@/pages/global-parameters/global-parameters-list/components/globalParametersListContent.tsx';

export const GlobalParametersListPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Overview of all global parameters.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-primary">
                Test Button
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <GlobalParametersListContent />
      </Container>
    </Fragment>
  );
};
