import { MembersDataGrid } from './blocks/members/membersDataGrid.tsx';
import { InvitePeople } from './blocks/invitePeople.tsx';
import { InviteWithLink } from './blocks/inviteWithLink.tsx';

export const MembersPageContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <MembersDataGrid />

      <div className="grid lg:grid-cols-2 gap-5 lg:gap-7.5">
        <InvitePeople />
        <InviteWithLink />
      </div>
    </div>
  );
};
