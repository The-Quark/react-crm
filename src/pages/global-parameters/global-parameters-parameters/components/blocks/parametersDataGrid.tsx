/* eslint-disable prettier/prettier */
import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/i18n';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import {
  DataGrid,
  DataGridColumnHeader,
  DataGridColumnVisibility,
  DataGridRowSelect,
  DataGridRowSelectAll,
  KeenIcon,
  useDataGrid,
  Menu,
  MenuItem,
  MenuToggle
} from '@/components';
import { toast } from 'sonner';
import { CircularProgress } from '@mui/material';
import { ParameterMenuOptions } from '@/pages/global-parameters/global-parameters-parameters/components/blocks/parametersMenuOptions.tsx';
import { getGlobalParameters } from '@/api';

interface ParametersModel {
  id: number;
  company_name: string;
  timezone: string;
  currency: string;
  language: string;
  legal_address: string;
  warehouse_address: string;
  airlines: string;
  dimensions_per_place?: string;
  cost_per_airplace?: string;
  package_standard_box1?: string | null;
  package_standard_box2?: string | null;
  cost_package_box1?: string | null;
  cost_package_box2?: string | null;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const ParametersDataGrid = () => {
  const { isRTL } = useLanguage();
  const [parameters, setParameters] = useState<ParametersModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getGlobalParameters()
      .then((parameters) => {
        const formattedData = parameters.result.map((parameter) => ({
          id: parameter.id,
          company_name: parameter.company_name,
          timezone: parameter.timezone,
          currency: parameter.currency,
          language: parameter.language,
          legal_address: parameter.legal_address,
          warehouse_address: parameter.warehouse_address,
          airlines: parameter.airlines
        }));
        setParameters(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching global parameters:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [reload]);

  const columns = useMemo<ColumnDef<ParametersModel>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row) => row.company_name,
        id: 'company name',
        header: ({ column }) => <DataGridColumnHeader title="Company" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col gap-0.5">
              <a
                className="leading-none font-medium text-sm text-gray-900 hover:text-primary"
                href="#"
              >
                {info.row.original.company_name}
              </a>
              <span className="text-2sm text-gray-700 font-normal">
                {`Language: ${info.row.original.language}, Currency: ${info.row.original.currency}`}
              </span>
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[300px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.timezone,
        id: 'timezone',
        header: ({ column }) => <DataGridColumnHeader title="Timezone" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-wrap gap-2.5 mb-2">
            <span className="badge badge-sm badge-light badge-outline">
              {info.row.original.timezone}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[165px]'
        }
      },
      {
        accessorFn: (row) => row.legal_address,
        id: 'legal address',
        header: ({ column }) => <DataGridColumnHeader title="Legal address" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.legal_address}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[165px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.warehouse_address,
        id: 'warehouse address',
        header: ({ column }) => <DataGridColumnHeader title="Warehouse address" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.warehouse_address}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[165px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.airlines,
        id: 'airlines',
        header: ({ column }) => <DataGridColumnHeader title="Airlines" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.airlines}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[165px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        id: 'click',
        header: () => '',
        enableSorting: false,
        cell: (info) => (
          <Menu className="items-stretch">
            <MenuItem
              toggle="dropdown"
              trigger="click"
              dropdownProps={{
                placement: isRTL() ? 'bottom-start' : 'bottom-end',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: isRTL() ? [0, -10] : [0, 10] // [skid, distance]
                    }
                  }
                ]
              }}
            >
              <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
                <KeenIcon icon="dots-vertical" />
              </MenuToggle>
              {ParameterMenuOptions({
                id: info.row.original.id,
                handleReload: () => setReload((prev) => !prev)
              })}
            </MenuItem>
          </Menu>
        ),
        meta: {
          headerClassName: 'w-[60px]'
        }
      }
    ],
    [isRTL]
  );

  const handleRowSelection = (state: RowSelectionState) => {
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

  const Toolbar = () => {
    const { table } = useDataGrid();

    return (
      <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
        <h3 className="card-title">Parameters</h3>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <KeenIcon
              icon="magnifier"
              className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
            />
            <input
              type="text"
              placeholder="Search Company"
              className="input input-sm ps-8"
              value={(table.getColumn('company name')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('company name')?.setFilterValue(event.target.value)
              }
            />
          </div>
          <DataGridColumnVisibility table={table} />
        </div>
      </div>
    );
  };

  return (
    <>
      {isLoading ? (
        <div className="card flex justify-center items-center p-5">
          <CircularProgress />
        </div>
      ) : (
        <DataGrid
          columns={columns}
          data={parameters}
          rowSelection={true}
          onRowSelectionChange={handleRowSelection}
          pagination={{ size: 10 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={<Toolbar />}
          layout={{ card: true }}
        />
      )}
    </>
  );
};
