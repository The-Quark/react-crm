/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { getSources } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { useSourcesColumns } from '@/pages/guides/tabs/sources/components/blocks/sourcesColumns.tsx';
import { SourcesToolbar } from '@/pages/guides/tabs/sources/components/blocks/sourcesToolbar.tsx';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { handleRowSelection } from '@/pages/guides/components/guidesHandlers.ts';

export const GuidesSourcesContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['guidesSources'],
    queryFn: () => getSources()
  });
  const columns = useSourcesColumns();

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      {isLoading ? (
        <SharedLoading />
      ) : (
        <DataGrid
          columns={columns}
          data={data?.result}
          rowSelection={true}
          onRowSelectionChange={handleRowSelection}
          pagination={{ size: 10 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={<SourcesToolbar />}
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};
