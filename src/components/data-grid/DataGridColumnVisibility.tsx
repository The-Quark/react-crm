import { useIntl } from 'react-intl';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { KeenIcon } from '@/components/keenicons';

interface IDataGridColumnVisibilityProps<TData> {
  table: Table<TData>;
  hideTitle?: boolean;
}

export function DataGridColumnVisibility<TData>({
  table,
  hideTitle = false
}: IDataGridColumnVisibilityProps<TData>) {
  const { formatMessage } = useIntl();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="light" size="sm">
          <KeenIcon icon="setting-4" />
          {!hideTitle && formatMessage({ id: 'SYSTEM.COLUMNS' })}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel className="font-medium">
          {formatMessage({ id: 'SYSTEM.TOGGLE_COLUMNS' })}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {formatMessage({
                  id: `SYSTEM.${column.id}`
                }) || column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
