import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { Log } from '@/api/get/getAuditLog/types.ts';
import { Container } from '@/components';

interface IGeneralSettingsProps {
  logs?: Log;
}

export const AuditChangesContent: FC<IGeneralSettingsProps> = ({ logs }) => {
  const { formatMessage } = useIntl();
  return (
    <Container>
      {!logs ? (
        <h3 className="text-center">{formatMessage({ id: 'SYSTEM.NO_CHANGES_FOUND' })}</h3>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{formatMessage({ id: 'SYSTEM.OLD_VALUES' })}</h3>
            </div>
            <div className="card-body grid gap-4">
              {logs?.changes &&
                Object.entries(logs.changes).map(([field, change]) => (
                  <div key={`old-${field}`} className="flex items-baseline gap-2.5">
                    <label className="form-label min-w-[120px] capitalize">{field}:</label>
                    <div className="flex-1">
                      {change.old?.toString() || formatMessage({ id: 'SYSTEM.NO_VALUE' })}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{formatMessage({ id: 'SYSTEM.NEW_VALUES' })}</h3>
            </div>
            <div className="card-body grid gap-4">
              {logs?.changes &&
                Object.entries(logs.changes).map(([field, change]) => (
                  <div key={`new-${field}`} className="flex items-baseline gap-2.5">
                    <label className="form-label min-w-[120px] capitalize">{field}:</label>
                    <div className="flex-1">
                      {change.new?.toString() || formatMessage({ id: 'SYSTEM.NO_VALUE' })}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};
