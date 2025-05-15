import { SharedHeader } from '@/partials/sharedUI';
import { DepartmentsListContent } from '@/pages/global-parameters/departments/departments-list/components/departmentsListContent.tsx';

export const DepartmentsListPage = () => {
  return (
    <>
      <SharedHeader />
      <DepartmentsListContent />
    </>
  );
};
