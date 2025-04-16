import React, { Fragment } from 'react';
import { Container } from '@/components';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import ClientStarterContent from '@/pages/clients/client-starter/components/clientStarterContent.tsx';

export const ClientStarterPage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Create new Client</ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <a href="#" className="btn btn-sm btn-light">
              Test Button
            </a>
            <a href="#" className="btn btn-sm btn-primary">
              Test Button
            </a>
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <ClientStarterContent />
      </Container>
    </Fragment>
  );
};
