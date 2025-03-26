import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { RolesPermissionPageContent } from './components/rolesPermissionPageContent';

export const RolesPermissionPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Overview of all team members and roles.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                View Roles
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <RolesPermissionPageContent />
      </Container>
    </Fragment>
  );
};
