import React from 'react';
import { Container } from '@/components';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { useIntl } from 'react-intl';

export const SharedHeader = () => {
  const intl = useIntl();
  return (
    <Container>
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle />
          <ToolbarDescription>
            {intl.formatMessage({ id: 'SYSTEM.OVERVIEW_ALL_RECORDS' })}
          </ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <button className="btn btn-sm btn-light">
            {intl.formatMessage({ id: 'SYSTEM.CSV_DOWNLOAD' })}
          </button>
        </ToolbarActions>
      </Toolbar>
    </Container>
  );
};
