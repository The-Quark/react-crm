import { useParams } from 'react-router';
import { getGlobalParameters } from '@/api/get';
import { CompaniesViewContentCard } from '@/pages/global-parameters/companies/companies-view/components/blocks/companiesViewContentCard.tsx';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

const DriversViewContent = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['global-parameter-id', id],
    queryFn: () => getGlobalParameters(Number(id))
  });

  if (isLoading) {
    return <SharedLoading />;
  }

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <CompaniesViewContentCard parameter={data?.result[0] ?? null} />
    </div>
  );
};

export { DriversViewContent };
