import React, { useState } from 'react';
import { Container } from '@/components';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getPermissionsMap } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { RolesStarterGiveContent } from '@/pages/roles-permissions/roles/rolesStarter/components/rolesStarterGiveContent.tsx';
import { RolesStarterRevokeContent } from '@/pages/roles-permissions/roles/rolesStarter/components/rolesStarterRevokeContent.tsx';

export const RolesStarterPage = () => {
  const [modeType, setModeType] = useState<'give' | 'revoke'>('give');
  const { role } = useParams<{ role: string }>();
  const isEditMode = !!role;

  const {
    data: permissionsData,
    isLoading: permissionsLoading,
    isError: permissionsIsError,
    error: permissionsError
  } = useQuery({
    queryKey: ['permissions map', role],
    queryFn: () => getPermissionsMap({ role: role }),
    enabled: isEditMode
  });

  if (isEditMode && permissionsIsError) {
    return <SharedError error={permissionsError} />;
  }

  return (
    <Container>
      {permissionsLoading ? (
        <SharedLoading />
      ) : (
        <div className="grid gap-5 lg:gap-7.5">
          <div className="card pb-2.5">
            <div className="card-header" id="general_settings">
              <div className="flex-col items-center gap-2.5">
                <label className="form-label max-w-56 text-base mb-2.5">Mode</label>

                <div className="flex items-center gap-5">
                  <label className="radio-group">
                    <input
                      className="radio-sm"
                      name="Give"
                      type="radio"
                      value="give"
                      checked={modeType === 'give'}
                      onChange={() => setModeType('give')}
                    />
                    <span className="radio-label">Give</span>
                  </label>
                  <label className="radio-group">
                    <input
                      className="radio-sm"
                      name="Revoke"
                      type="radio"
                      value="revoke"
                      checked={modeType === 'revoke'}
                      onChange={() => setModeType('revoke')}
                    />
                    <span className="radio-label">Revoke</span>
                  </label>
                </div>
              </div>
            </div>

            {isEditMode && !permissionsData ? null : modeType === 'give' ? (
              <RolesStarterGiveContent data={permissionsData?.result.give} role={role} />
            ) : (
              <RolesStarterRevokeContent data={permissionsData?.result.revoke} role={role} />
            )}
          </div>
        </div>
      )}
    </Container>
  );
};
