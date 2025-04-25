import React from 'react';
import { Container } from '@/components';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';

export const SharedHeader = () => {
  return (
    <Container>
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle />
          <ToolbarDescription>Overview of all records.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <button className="btn btn-sm btn-light">Future CSV Download</button>
        </ToolbarActions>
      </Toolbar>
    </Container>
  );
};
