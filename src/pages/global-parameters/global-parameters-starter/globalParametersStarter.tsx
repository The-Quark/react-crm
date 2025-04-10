import React, { Fragment } from 'react';
import { Container } from '@/components';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { GlobalParameterStarterContent } from '@/pages/global-parameters/global-parameters-starter/components/globalParameterStarterContent.tsx';

export const GlobalParametersStarter = () => {
  const { currentLayout } = useLayout();
  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Create new Global Parameter</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Test Button
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Test Button
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <GlobalParameterStarterContent />
      </Container>
    </Fragment>
  );
};
