import React, { useState } from 'react';
import ClientStarterContentIndividual from '@/pages/clients/client-starter/components/blocks/clientStarterContentIndividual.tsx';
import ClientStarterContentLegal from '@/pages/clients/client-starter/components/blocks/clientStarterContentLegal.tsx';

const ClientStarterContent = () => {
  const [clientType, setClientType] = useState<'individual' | 'legal'>('individual');

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="card pb-2.5">
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

        {clientType === 'individual' ? (
          <ClientStarterContentIndividual />
        ) : (
          <ClientStarterContentLegal />
        )}
      </div>
    </div>
  );
};

export default ClientStarterContent;
