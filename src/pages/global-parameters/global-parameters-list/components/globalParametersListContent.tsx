import { ParametersDataGrid } from '@/pages/global-parameters/global-parameters-list/components/blocks/parametersDataGrid.tsx';

export const GlobalParametersListContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <ParametersDataGrid />
    </div>
  );
};
