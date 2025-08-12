import React, { useEffect, useState } from 'react';
import ClientStarterContentIndividual from '@/pages/clients/client-starter/components/blocks/clientStarterContentIndividual.tsx';
import ClientStarterContentLegal from '@/pages/clients/client-starter/components/blocks/clientStarterContentLegal.tsx';
import { Container } from '@/components';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getClients, getSources } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { SEARCH_PER_PAGE } from '@/utils';
import { useIntl } from 'react-intl';

const ClientStarterContent = () => {
  const { id } = useParams<{ id: string }>();
  const { formatMessage } = useIntl();
  const [clientType, setClientType] = useState('');

  const isEditMode = !!id;

  const {
    data: clientData,
    isLoading: clientLoading,
    isError: clientIsError,
    error: clientError
  } = useQuery({
    queryKey: ['client-by-id', id],
    queryFn: () => getClients({ id: id ? parseInt(id) : undefined }),
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    enabled: isEditMode
  });

  const {
    data: sourcesData,
    isLoading: sourcesLoading,
    isError: sourcesIsError,
    error: sourcesError
  } = useQuery({
    queryKey: ['sources'],
    queryFn: () => getSources({ is_active: true, per_page: SEARCH_PER_PAGE })
  });

  useEffect(() => {
    if (clientData?.result?.[0]?.type && clientType !== clientData.result[0].type) {
      setClientType(clientData.result[0].type);
    }
  }, [clientData]);

  if (isEditMode && clientIsError) {
    return <SharedError error={clientError} />;
  }

  if (sourcesIsError) {
    return <SharedError error={sourcesError} />;
  }

  return (
    <Container>
      {clientLoading || sourcesLoading ? (
        <SharedLoading />
      ) : (
        <div className="grid gap-5 lg:gap-7.5">
          <div className="card pb-5">
            {!isEditMode ? (
              <div className="card-header" id="general_settings">
                <div className="flex-col items-center gap-2.5">
                  <label className="form-label max-w-56 text-base mb-2.5">
                    {formatMessage({ id: 'SYSTEM.CLIENT_TYPE' })}
                  </label>

                  <div className="flex items-center gap-5">
                    <label className="radio-group">
                      <input
                        className="radio-sm"
                        name="clientType"
                        type="radio"
                        value="individual"
                        checked={clientType === 'individual'}
                        onChange={() => setClientType('individual')}
                      />
                      <span className="radio-label">
                        {formatMessage({ id: 'SYSTEM.INDIVIDUAL' })}
                      </span>
                    </label>
                    <label className="radio-group">
                      <input
                        className="radio-sm"
                        name="clientType"
                        type="radio"
                        value="legal"
                        checked={clientType === 'legal'}
                        onChange={() => setClientType('legal')}
                      />
                      <span className="radio-label">{formatMessage({ id: 'SYSTEM.LEGAL' })}</span>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-header" id="general_settings">
                <h3 className="card-title">
                  {clientType === 'individual'
                    ? formatMessage({ id: 'SYSTEM.INDIVIDUAL' })
                    : formatMessage({ id: 'SYSTEM.LEGAL' })}
                </h3>
              </div>
            )}
            {clientType === 'individual' ? (
              <ClientStarterContentIndividual
                clientData={isEditMode ? clientData?.result[0] : undefined}
                sourcesData={sourcesData?.result}
              />
            ) : clientType === 'legal' ? (
              <ClientStarterContentLegal
                clientData={isEditMode ? clientData?.result[0] : undefined}
                sourcesData={sourcesData?.result}
              />
            ) : null}
          </div>
        </div>
      )}
    </Container>
  );
};

export default ClientStarterContent;
