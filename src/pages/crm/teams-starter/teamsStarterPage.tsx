import React, { Fragment } from 'react';
import { PageNavbar } from '@/pages/account';
import { Container } from '@/components';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { TeamsStarterPageContent } from './components/teamsStarterPageContent';

export const TeamsStarterPage = () => {
  const { currentLayout } = useLayout();
  return (
    <Fragment>
      <PageNavbar />

      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                Efficient team organization with real-time updates
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Plans
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <TeamsStarterPageContent />
      </Container>
    </Fragment>
  );
};
