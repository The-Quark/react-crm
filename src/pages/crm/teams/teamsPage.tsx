import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { TeamsPageContent } from './components/teamsPageContent.tsx';

export const TeamsPage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>
              efficient team organization with real-time updates
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <a href="#" className="btn btn-sm btn-light">
              Add New Team
            </a>
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <TeamsPageContent />
      </Container>
    </Fragment>
  );
};
