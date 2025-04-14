import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { MemberUpdatePageContent } from '@/pages/crm/member-update/components/memberUpdatePageContent.tsx';

export const MemberUpdatePage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Update Member Information</ToolbarDescription>
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
        <MemberUpdatePageContent />
      </Container>
    </Fragment>
  );
};
