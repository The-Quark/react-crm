import React, { useState } from 'react';
import { Container } from '@/components';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getClients } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

export const RolesStarterPage = () => {
  const [modeType, setModeType] = useState<'give' | 'revoke'>('give');
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const {
    data: clientData,
    isLoading: clientLoading,
    isError: clientIsError,
    error: clientError
  } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClients({ id: id as string }),
    enabled: isEditMode
  });

  if (isEditMode && clientIsError) {
    return <SharedError error={clientError} />;
  }

  return (
    <Container>
      {clientLoading ? (
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
                      name="clientType"
                      type="radio"
                      value="individual"
                      checked={modeType === 'give'}
                      onChange={() => setModeType('give')}
                    />
                    <span className="radio-label">Individual</span>
                  </label>
                  <label className="radio-group">
                    <input
                      className="radio-sm"
                      name="clientType"
                      type="radio"
                      value="legal"
                      checked={modeType === 'revoke'}
                      onChange={() => setModeType('revoke')}
                    />
                    <span className="radio-label">Legal</span>
                  </label>
                </div>
              </div>
            </div>

            {isEditMode && !clientData ? null : modeType === 'give' ? <>give</> : <>revoke</>}
          </div>
        </div>
      )}
    </Container>
  );
};
