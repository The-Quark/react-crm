import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { MembersPageContent } from '@/pages/crm/members/components/membersPageContent.tsx';

export const MembersPage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Overview of all members and roles.</ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <a href="/crm/member-starter" className="btn btn-sm btn-secondary">
              CSV
            </a>
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <MembersPageContent />
      </Container>
    </Fragment>
  );
};
