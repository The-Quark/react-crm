import React, { Fragment } from 'react';
import { Container } from '@/components';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { GuidesCurrenciesContent } from '@/pages/guides/currencies/components/guidesCurrenciesContent.tsx';

export const GuidesCurrenciesPage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Overview of all currencies.</ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <button className="btn btn-sm btn-light">Future CSV Download</button>
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <GuidesCurrenciesContent />
      </Container>
    </Fragment>
  );
};
