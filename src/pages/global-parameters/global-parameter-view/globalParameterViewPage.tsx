import React, { Fragment } from 'react';
import { Container } from '@/components';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { GlobalParameterViewContent } from '@/pages/global-parameters/global-parameter-view/components/globalParamaterViewContent.tsx';

export const GlobalParameterViewPage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Test description</ToolbarDescription>
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

      <Container>
        <GlobalParameterViewContent />
      </Container>
    </Fragment>
  );
};
