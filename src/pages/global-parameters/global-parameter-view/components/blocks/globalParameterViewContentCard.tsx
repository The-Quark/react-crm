import { FC } from 'react';
import { ParametersModel } from '@/api/get/getGlobalParameters/types.ts';

interface IGeneralSettingsProps {
  title: string;
  parameter: ParametersModel | null;
}

export const GlobalParameterViewContentCard: FC<IGeneralSettingsProps> = ({ title, parameter }) => {
  return (
    <form className="card pb-2.5" noValidate>
      <div className="card-header" id="general_settings">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-body grid gap-5">
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Company Name</label>
          <div className="flex columns-1 w-full flex-wrap">{parameter?.company_name}</div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Time zone</label>
          <div className="flex columns-1 w-full flex-wrap">{parameter?.timezone}</div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Currency</label>
          <div className="flex columns-1 w-full flex-wrap">{parameter?.currency}</div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Language</label>
          <div className="flex columns-1 w-full flex-wrap">{parameter?.language}</div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Legal Address</label>
          <div className="flex columns-1 w-full flex-wrap">{parameter?.legal_address}</div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Warehouse Address</label>
          <div className="flex columns-1 w-full flex-wrap">{parameter?.warehouse_address}</div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Airlines</label>
          <div className="flex columns-1 w-full flex-wrap">{parameter?.airlines}</div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Dimension Per Place</label>
          <div className="flex columns-1 w-full flex-wrap">{parameter?.dimensions_per_place}</div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Cost Per Airplace</label>
          <div className="flex columns-1 w-full flex-wrap">{parameter?.cost_per_airplace}</div>
        </div>
      </div>
    </form>
  );
};

export { type IGeneralSettingsProps };
