import React, { Fragment } from 'react';
import { Container } from '@/components';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { ClientsListContent } from '@/pages/clients/clients-list/components/clientsListContent.tsx';

export const ClientsListPage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Overview of all clients.</ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <a href="#" className="btn btn-sm btn-primary">
              Test Button
            </a>
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <ClientsListContent />
      </Container>
    </Fragment>
  );
};
