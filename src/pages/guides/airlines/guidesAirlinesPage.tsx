import React, { Fragment } from 'react';
import { Container } from '@/components';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { GuidesAirlinesContent } from '@/pages/guides/airlines/components/guidesAirlinesContent.tsx';

export const GuidesAirlinesPage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Overview of all airlines.</ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <button className="btn btn-sm btn-light">Future CSV Download</button>
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <GuidesAirlinesContent />
      </Container>
    </Fragment>
  );
};
