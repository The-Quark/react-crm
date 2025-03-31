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
import { getUserList } from './membersApi.ts';
import { toAbsoluteUrl } from '@/utils/index.ts';
import { CircularProgress } from '@mui/material';
import { MemberMenuOptions } from '@/pages/crm/members/components/blocks/members/memberMenuOptions.tsx';

interface Member {
  member: {
    id?: number;
    avatar?: string | null;
    name: string;
    position?: string | null;
  };
  role?: string;
  location?: string | null;
  recentlyActivity: string;
}
const STORAGE_URL = import.meta.env.VITE_APP_STORAGE_URL;
const USERS_LIST_AVATAR_URL = `${STORAGE_URL}/avatars`;

export const MembersDataGrid = () => {
  const { isRTL } = useLanguage();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getUserList()
      .then((users) => {
        const formattedData = users.result.map((user) => ({
          member: {
            id: user.id,
            avatar: user.avatar,
            name: user.name,
            position: user.position ?? 'No position'
          },
          role: user.roles?.[0]?.name ?? 'No role',
          location: user.location ?? 'No location',
          recentlyActivity: new Date(user.updated_at).toLocaleString()
        }));
        setMembers(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [reload]);

  const columns = useMemo<ColumnDef<Member>[]>(
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
        accessorFn: (row) => row.member,
        id: 'member',
        header: ({ column }) => <DataGridColumnHeader title="Member" column={column} />,
        enableSorting: true,
        filterFn: (row, columnId, filterValue) => {
          const member = row.original.member;
          const nameMatch = member.name?.toLowerCase().includes(filterValue.toLowerCase());
          return nameMatch;
        },
        cell: (info) => (
          <div className="flex items-center gap-2.5">
            <div className="shrink-0">
              <img
                src={
                  info.row.original.member.avatar
                    ? `${USERS_LIST_AVATAR_URL}/${info.row.original.member.avatar}`
                    : toAbsoluteUrl('/media/avatars/blank.png')
                }
                className="h-9 rounded-full"
                alt="Avatar"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <a
                className="leading-none font-medium text-sm text-gray-900 hover:text-primary"
                href="#"
              >
                {info.row.original.member.name}
              </a>
              <span className="text-2sm text-gray-700 font-normal">
                {info.row.original.member.position}
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
        accessorFn: (row) => row.role,
        id: 'roles',
        header: ({ column }) => <DataGridColumnHeader title="Roles" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-wrap gap-2.5 mb-2">
            <span className="badge badge-sm badge-light badge-outline">
              {info.row.original.role}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[165px]'
        }
      },
      {
        accessorFn: (row) => row.location,
        id: 'location',
        header: ({ column }) => <DataGridColumnHeader title="Location" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="leading-none text-gray-800 font-normal">
              {info.row.original.location}
            </span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[165px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.recentlyActivity,
        id: 'recentlyActivity',
        header: ({ column }) => <DataGridColumnHeader title="Recent activity" column={column} />,
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: {
          headerTitle: 'Recent activity',
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
              {MemberMenuOptions({
                id: info.row.original.member.id,
                handleReload: () => setReload(!reload)
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
        <h3 className="card-title">Members</h3>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <KeenIcon
              icon="magnifier"
              className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
            />
            <input
              type="text"
              placeholder="Search Members"
              className="input input-sm ps-8"
              value={(table.getColumn('member')?.getFilterValue() as string) ?? ''}
              onChange={(event) => table.getColumn('member')?.setFilterValue(event.target.value)}
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
          data={members}
          rowSelection={true}
          onRowSelectionChange={handleRowSelection}
          pagination={{ size: 10 }}
          sorting={[{ id: 'member', desc: false }]}
          toolbar={<Toolbar />}
          layout={{ card: true }}
        />
      )}
    </>
  );
};
