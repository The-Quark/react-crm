import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n';
import {
  KeenIcon,
  Menu,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSub,
  MenuTitle,
  MenuToggle
} from '@/components';
import { CommonHexagonBadge } from '@/partials/common';
import React, { ReactNode } from 'react';
import { useIntl } from 'react-intl';

interface Badge {
  size: string;
  badge: ReactNode;
  fill: string;
  stroke: string;
}

interface IRoleProps {
  badge?: Badge;
  title: string;
  subTitle?: string;
  description?: string;
  team?: string;
  path?: string;
  disableMenu?: boolean;
  roleName: string;
}

export const RolesListCard = ({
  path,
  title,
  subTitle,
  description,
  team,
  badge,
  disableMenu,
  roleName
}: IRoleProps) => {
  const { formatMessage } = useIntl();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="card flex flex-col gap-5 p-5 lg:p-7.5">
      <div className="flex items-center flex-wrap justify-between gap-1">
        <div className="flex items-center gap-2.5">
          <CommonHexagonBadge {...badge} />

          <div className="flex flex-col">
            <Link
              to={`${path}`}
              className="text-md font-medium text-gray-900 hover:text-primary-active mb-px"
            >
              {title}
            </Link>
            <span className="text-2sm text-gray-700">{subTitle}</span>
          </div>
        </div>

        {!disableMenu && (
          <Menu className="inline-flex">
            <MenuItem
              toggle="dropdown"
              trigger="click"
              dropdownProps={{
                placement: isRTL() ? 'bottom-start' : 'bottom-end',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: isRTL() ? [0, -10] : [0, 10]
                    }
                  }
                ]
              }}
            >
              <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
                <KeenIcon icon="dots-vertical" />
              </MenuToggle>
              <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
                <MenuItem onClick={() => navigate(`/roles-permissions/roles/starter/${roleName}`)}>
                  <MenuLink>
                    <MenuIcon>
                      <KeenIcon icon="setting-4" />
                    </MenuIcon>
                    <MenuTitle>{formatMessage({ id: 'SYSTEM.EDIT_PERMISSIONS' })}</MenuTitle>
                  </MenuLink>
                </MenuItem>
              </MenuSub>
            </MenuItem>
          </Menu>
        )}
      </div>

      <p className="text-2sm text-gray-700">{description}</p>

      <span className="text-2sm text-gray-800">{team}</span>
    </div>
  );
};
