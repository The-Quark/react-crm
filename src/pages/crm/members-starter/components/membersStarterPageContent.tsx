import { MembersStarterPageContentUserCRUD } from '@/pages/crm/members-starter/components/blocks/membersStarterPageContentUserCRUD.tsx';

const MembersStarterPageContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <MembersStarterPageContentUserCRUD title="Create New User" />
    </div>
  );
};

export { MembersStarterPageContent };
