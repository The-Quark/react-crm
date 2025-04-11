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
import { GlobalParameterUpdateContent } from '@/pages/global-parameters/global-parameter-update/components/globalParameterUpdateContent.tsx';

export const GlobalParameterUpdatePage = () => {
  const { currentLayout } = useLayout();
  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Update Global Parameter</ToolbarDescription>
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
        <GlobalParameterUpdateContent />
      </Container>
    </Fragment>
  );
};
