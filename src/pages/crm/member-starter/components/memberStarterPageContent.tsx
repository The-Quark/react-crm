import { MemberStarterPageContentUserCRUD } from '@/pages/crm/member-starter/components/blocks/memberStarterPageContentUserCRUD.tsx';

const MemberStarterPageContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <MemberStarterPageContentUserCRUD title="Create New User" />
    </div>
  );
};

export { MemberStarterPageContent };
