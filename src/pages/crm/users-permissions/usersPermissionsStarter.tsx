import React, { useState } from 'react';
import { Container } from '@/components';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getPermissionsMap } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { UsersPermissionsGive } from '@/pages/crm/users-permissions/components/usersPermissionsGive.tsx';
import { UsersPermissionsRevoke } from '@/pages/crm/users-permissions/components/usersPermissionsRevoke.tsx';
import { useIntl } from 'react-intl';

export const UsersPermissionsStarter = () => {
  const [modeType, setModeType] = useState<'give' | 'revoke'>('give');
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { formatMessage } = useIntl();

  const {
    data: permissionsData,
    isLoading: permissionsLoading,
    isError: permissionsIsError,
    error: permissionsError
  } = useQuery({
    queryKey: ['permissions-map-user', id],
    queryFn: () => getPermissionsMap({ user_id: Number(id) }),
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
                <label className="form-label max-w-56 text-base mb-2.5">
                  {formatMessage({ id: 'SYSTEM.MODE' })}
                </label>

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
                    <span className="radio-label"> {formatMessage({ id: 'SYSTEM.GIVE' })}</span>
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
                    <span className="radio-label">{formatMessage({ id: 'SYSTEM.REVOKE' })}</span>
                  </label>
                </div>
              </div>
            </div>

            {isEditMode && !permissionsData ? null : modeType === 'give' ? (
              <UsersPermissionsGive userId={Number(id)} data={permissionsData?.result.give} />
            ) : (
              <UsersPermissionsRevoke userId={Number(id)} data={permissionsData?.result.revoke} />
            )}
          </div>
        </div>
      )}
    </Container>
  );
};
