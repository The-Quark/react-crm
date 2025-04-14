import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { MemberRoleUpdatePageContent } from '@/pages/crm/member-role-update/components/memberRoleUpdatePageContent.tsx';

export const MemberRoleUpdatePage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Update Member Role</ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <a href="#" className="btn btn-sm btn-light">
              Test Buttons
            </a>
            <a href="#" className="btn btn-sm btn-primary">
              Test Buttons
            </a>
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <MemberRoleUpdatePageContent />
      </Container>
    </Fragment>
  );
};
