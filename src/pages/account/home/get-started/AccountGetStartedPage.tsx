import { Fragment } from 'react';
import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';
import { AccountGetStartedContent } from '.';
import { useLayout } from '@/providers';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '@/api';

const AccountGetStartedPage = () => {
  const { currentLayout } = useLayout();
  const { data: currentUser } = useCurrentUser();

  return (
    <Fragment>
      <PageNavbar />

      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-gray-800 font-medium">
                    {currentUser ? currentUser.name : 'Not Found'}
                  </span>
                  <a href="#" className="text-gray-700 hover:text-primary">
                    {currentUser ? currentUser.email : 'Not Found'}
                  </a>
                  <span className="size-0.75 bg-gray-600 rounded-full"></span>
                  <Link to="/account/members/team-info" className="font-semibold btn btn-link link">
                    Personal Info
                  </Link>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
          </Toolbar>
        </Container>
      )}

      <Container>
        <AccountGetStartedContent />
      </Container>
    </Fragment>
  );
};

export { AccountGetStartedPage };
