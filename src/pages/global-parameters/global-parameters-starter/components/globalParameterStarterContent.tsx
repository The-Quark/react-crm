import { GlobalParameterCreateFrom } from '@/pages/global-parameters/global-parameters-starter/components/blocks/globalParameterCreateForm.tsx';

const GlobalParameterStarterContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <GlobalParameterCreateFrom title="Create new Global Parameter" />
    </div>
  );
};

export { GlobalParameterStarterContent };
