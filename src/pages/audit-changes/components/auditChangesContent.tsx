import { FC } from 'react';
import { ParametersModel } from '@/api/get/getGlobalParams/getGlobalParameters/types.ts';
import { useIntl } from 'react-intl';

interface IGeneralSettingsProps {
  parameter: ParametersModel | null;
}

export const AuditChangesContent: FC<IGeneralSettingsProps> = ({ parameter }) => {
  const { formatMessage } = useIntl();
  return (
    <div className="card pb-2.5">
      <div className="card-header" id="general_settings">
        <h3 className="card-title">{formatMessage({ id: 'SYSTEM.COMPANY' })}</h3>
      </div>
      <div className="card-body grid gap-5">
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">
            {formatMessage({ id: 'SYSTEM.COMPANY_NAME' })}
          </label>
          <div className="flex columns-1 w-full flex-wrap">{parameter?.company_name}</div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56"> {formatMessage({ id: 'SYSTEM.TIMEZONE' })}</label>
          <div className="flex columns-1 w-full flex-wrap">{parameter?.timezone}</div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56"> {formatMessage({ id: 'SYSTEM.CURRENCY' })}</label>
          <div className="flex columns-1 w-full flex-wrap">{parameter?.currency}</div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56"> {formatMessage({ id: 'SYSTEM.LANGUAGE' })}</label>
          <div className="flex columns-1 w-full flex-wrap">{parameter?.language.name}</div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">
            {formatMessage({ id: 'SYSTEM.LEGAL_ADDRESS' })}
          </label>
          <div className="flex columns-1 w-full flex-wrap">{parameter?.legal_address}</div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">
            {formatMessage({ id: 'SYSTEM.WAREHOUSE_ADDRESS' })}
          </label>
          <div className="flex columns-1 w-full flex-wrap">{parameter?.warehouse_address}</div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">{formatMessage({ id: 'SYSTEM.AIRLINES' })}</label>
          <div className="flex columns-1 w-full flex-wrap">
            {parameter?.airlines.map((airline) => airline.name).join(', ')}
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">
            {formatMessage({ id: 'SYSTEM.DIMENSIONS_PER_PLACE' })}
          </label>
          <div className="flex columns-1 w-full flex-wrap">{parameter?.dimensions_per_place}</div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">
            {formatMessage({ id: 'SYSTEM.COST_PER_PLACE' })}
          </label>
          <div className="flex columns-1 w-full flex-wrap">{parameter?.cost_per_airplace}</div>
        </div>
      </div>
    </div>
  );
};
