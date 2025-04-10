import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { GlobalParametersParametersContent } from '@/pages/global-parameters/global-parameters-parameters/components/globalParametersParametersContent.tsx';

export const GlobalParametersParametersPage = () => {
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
              <a href="/crm/member-starter" className="btn btn-sm btn-primary">
                Add Global Parameter
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <GlobalParametersParametersContent />
      </Container>
    </Fragment>
  );
};
