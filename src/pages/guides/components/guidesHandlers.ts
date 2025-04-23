import { RowSelectionState } from '@tanstack/react-table';
import { toast } from 'sonner';

export const handleRowSelection = (state: RowSelectionState) => {
  const selectedRowIds = Object.keys(state);

  if (selectedRowIds.length > 0) {
    toast(`Total ${selectedRowIds.length} are selected.`, {
      description: `Selected row IDs: ${selectedRowIds}`,
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo')
      }
    });
  }
};
