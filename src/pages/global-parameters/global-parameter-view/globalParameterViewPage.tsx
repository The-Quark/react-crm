import React, { Fragment } from 'react';
import { Container } from '@/components';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { GlobalParameterViewContent } from '@/pages/global-parameters/global-parameter-view/components/globalParamaterViewContent.tsx';
import { useUserPermissions } from '@/hooks';

export const GlobalParameterViewPage = () => {
  const { has } = useUserPermissions();
  const canManageGlobalSettings =
    has('manage global settings') || has('manage global contexted settings') || has('everything');
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>Test description</ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <a href="#" className="btn btn-sm btn-light">
              Test Button
            </a>
            {canManageGlobalSettings && (
              <a
                href={`/global-parameters/update-parameters/${1}`}
                className="btn btn-sm btn-primary"
              >
                Edit Global Parameters
              </a>
            )}
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <GlobalParameterViewContent />
      </Container>
    </Fragment>
  );
};
