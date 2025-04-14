import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { RolesPageContent } from './components/rolesPageContent.tsx';

export const RolesPage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Overview of all team members and roles.</ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <a href="#" className="btn btn-sm btn-light">
              Test Button
            </a>
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <RolesPageContent />
      </Container>
    </Fragment>
  );
};
