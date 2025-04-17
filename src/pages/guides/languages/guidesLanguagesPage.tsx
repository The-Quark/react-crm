import React, { Fragment } from 'react';
import { Container } from '@/components';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { GuidesLanguagesContent } from '@/pages/guides/languages/components/guidesLanguagesContent.tsx';

export const GuidesLanguagesPage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Overview of all languages.</ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <button className="btn btn-sm btn-light">Future CSV Download</button>
            <button className="btn btn-sm btn-primary">New Language</button>
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <GuidesLanguagesContent />
      </Container>
    </Fragment>
  );
};
