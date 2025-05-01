import { MemberUpdatePageContentUserForm } from '@/pages/crm/member-update/components/blocks/memberUpdatePageContentUserForm.tsx';
import { useParams } from 'react-router';
import { getMemberById } from '@/api/get';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

const MemberUpdatePageContent = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: userData,
    isLoading: userLoading,
    isError: userIsError,
    error: userError
  } = useQuery({
    queryKey: ['member-update-user', id],
    queryFn: () => getMemberById(Number(id)),
    enabled: !!id
  });

  if (userLoading) {
    return <SharedLoading />;
  }

  if (userIsError) {
    return <SharedError error={userError} />;
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <MemberUpdatePageContentUserForm title="Update User" user={userData ?? null} />
    </div>
  );
};

export { MemberUpdatePageContent };
