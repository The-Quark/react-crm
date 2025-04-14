import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { PermissionsPageContent } from '@/pages/roles-permissions/permissions/components/permissionsPageContent.tsx';

export const PermissionPage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Test Mock</ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <a href="/crm/roles" className="btn btn-sm btn-light">
              View Roles
            </a>
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <PermissionsPageContent />
      </Container>
    </Fragment>
  );
};
