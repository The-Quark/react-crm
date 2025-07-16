import React from 'react';
import { useDataGrid } from '.';
import { ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/lib/utils.ts';
import { useIntl } from 'react-intl';

const DataGridPagination = () => {
  const { table, props } = useDataGrid();
  const { formatMessage } = useIntl();
  const btnBaseClasses = 'size-7 p-0 text-[13px]';
  const btnArrowClasses = btnBaseClasses + ' rtl:transform rtl:rotate-180';
  const totalRows = props.pagination?.total || 0;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;

  // Поскольку pageIndex начинается с 1, корректируем расчет диапазона
  const from = (pageIndex - 1) * pageSize + 1;
  const to = Math.min(pageIndex * pageSize, totalRows);

  // Replace placeholders in paginationInfo
  const paginationInfo = formatMessage(
    { id: 'SYSTEM.PAGINATION_INFO' },
    {
      from: from.toString(),
      to: to.toString(),
      count: totalRows.toString()
    }
  );

  // Pagination limit logic
  const pageCount = table.getPageCount();
  const paginationMoreLimit = props.pagination?.moreLimit || 5;

  // Корректируем группировку для pageIndex начинающегося с 1
  const currentGroupStart =
    Math.floor((pageIndex - 1) / paginationMoreLimit) * paginationMoreLimit + 1;
  const currentGroupEnd = Math.min(currentGroupStart + paginationMoreLimit, pageCount + 1);

  // Render page buttons based on the current group
  const renderPageButtons = () => {
    const buttons = [];
    for (let i = currentGroupStart; i < currentGroupEnd; i++) {
      buttons.push(
        <Button
          key={i}
          variant="ghost"
          className={cn(btnBaseClasses, 'text-muted-foreground', {
            'bg-accent text-accent-foreground': pageIndex === i
          })}
          onClick={() => table.setPageIndex(i)}
        >
          {i}
        </Button>
      );
    }
    return buttons;
  };

  // Render a "previous" ellipsis button if there are previous pages to show
  const renderEllipsisPrevButton = () => {
    if (currentGroupStart > 1) {
      return (
        <Button
          className={btnBaseClasses}
          variant="ghost"
          onClick={() => table.setPageIndex(currentGroupStart - 1)}
        >
          ...
        </Button>
      );
    }
    return null; // No ellipsis needed if we're in the first group
  };

  // Render a "next" ellipsis button if there are more pages to show after the current group
  const renderEllipsisNextButton = () => {
    if (currentGroupEnd <= pageCount) {
      return (
        <Button
          className={btnBaseClasses}
          variant="ghost"
          onClick={() => table.setPageIndex(currentGroupEnd)}
        >
          ...
        </Button>
      );
    }
    return null;
  };

  return (
    <div
      className="flex flex-col md:flex-row justify-between items-center gap-5 md:gap-4"
      data-pagination
    >
      <div className="flex items-center space-x-2 order-2 md:order-1 pb-2 md:pb-0">
        <div className="text-sm text-muted-foreground">
          {formatMessage({ id: 'SYSTEM.ROWS_PER_PAGE' })}
        </div>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="w-[70px]" size="sm">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {props.pagination?.sizes?.map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2 order-1 md:order-2 pt-2 md:pt-0">
        <div className="text-sm text-muted-foreground">{paginationInfo}</div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            className={btnArrowClasses}
            onClick={() => table.previousPage()}
            disabled={pageIndex <= 1}
          >
            <span className="sr-only">{formatMessage({ id: 'SYSTEM.GO_TO_PREVIOUS_PAGE' })}</span>
            <ChevronLeftIcon className="size-4" />
          </Button>

          {renderEllipsisPrevButton()}

          <>{renderPageButtons()}</>

          {renderEllipsisNextButton()}

          <Button
            variant="ghost"
            className={btnArrowClasses}
            onClick={() => table.nextPage()}
            disabled={pageIndex >= pageCount}
          >
            <span className="sr-only">{formatMessage({ id: 'SYSTEM.GO_TO_NEXT_PAGE' })}</span>
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export { DataGridPagination };
