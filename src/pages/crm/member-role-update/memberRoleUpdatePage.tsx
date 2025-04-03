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
import { MemberRoleUpdatePageContent } from '@/pages/crm/member-role-update/components/memberRoleUpdatePageContent.tsx';

export const MemberRoleUpdatePage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
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
      )}

      <Container>
        <MemberRoleUpdatePageContent />
      </Container>
    </Fragment>
  );
};
