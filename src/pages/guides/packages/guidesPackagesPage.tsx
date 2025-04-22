import React, { Fragment } from 'react';
import { Container } from '@/components';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { GuidesPackagesContent } from '@/pages/guides/packages/components/guidesPackageContent.tsx';

export const GuidesPackagesPage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Overview of all packages.</ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <button className="btn btn-sm btn-light">Future CSV Download</button>
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <GuidesPackagesContent />
      </Container>
    </Fragment>
  );
};
