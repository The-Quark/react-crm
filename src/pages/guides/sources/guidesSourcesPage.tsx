import React, { Fragment } from 'react';
import { Container } from '@/components';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { GuidesSourcesContent } from '@/pages/guides/sources/components/guidesSourcesContent.tsx';

export const GuidesSourcesPage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Overview of all sources.</ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <button className="btn btn-sm btn-light">Future CSV Download</button>
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <GuidesSourcesContent />
      </Container>
    </Fragment>
  );
};
