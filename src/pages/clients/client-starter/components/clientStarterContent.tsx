import React, { useEffect, useState } from 'react';
import ClientStarterContentIndividual from '@/pages/clients/client-starter/components/blocks/clientStarterContentIndividual.tsx';
import ClientStarterContentLegal from '@/pages/clients/client-starter/components/blocks/clientStarterContentLegal.tsx';
import { Container } from '@/components';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getClients, getSources } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { SEARCH_PER_PAGE } from '@/utils';

const ClientStarterContent = () => {
  const [clientType, setClientType] = useState<'individual' | 'legal'>('individual');
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const {
    data: clientData,
    isLoading: clientLoading,
    isError: clientIsError,
    error: clientError
  } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClients({ id: id ? parseInt(id) : undefined }),
    enabled: isEditMode
  });

  const {
    data: sourcesData,
    isLoading: sourcesLoading,
    isError: sourcesIsError,
    error: sourcesError
  } = useQuery({
    queryKey: ['sources'],
    queryFn: () => getSources({ is_active: true, per_page: SEARCH_PER_PAGE }),
    staleTime: 60 * 60 * 1000
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
                  <label className="form-label max-w-56 text-base mb-2.5">Client type</label>

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
                      <span className="radio-label">Individual</span>
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
                      <span className="radio-label">Legal</span>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-header" id="general_settings">
                <h3 className="card-title">
                  {clientType === 'individual' ? 'Individual client' : 'Legal client'}
                </h3>
              </div>
            )}
            {isEditMode && !clientData ? null : clientType === 'individual' ? (
              <ClientStarterContentIndividual
                clientData={isEditMode ? clientData?.result[0] : undefined}
                sourcesData={sourcesData?.result}
              />
            ) : (
              <ClientStarterContentLegal
                clientData={isEditMode ? clientData?.result[0] : undefined}
                sourcesData={sourcesData?.result}
              />
            )}
          </div>
        </div>
      )}
    </Container>
  );
};

export default ClientStarterContent;
