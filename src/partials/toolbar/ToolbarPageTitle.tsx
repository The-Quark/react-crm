import { useLocation } from 'react-router';

import { useMenuCurrentItem } from '@/components/menu';
import { useMenus } from '@/providers';

import { IToolbarPageTitleProps } from './types';
import { useIntl } from 'react-intl';

const ToolbarPageTitle = ({ text }: IToolbarPageTitleProps) => {
  const { pathname } = useLocation();
  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig('primary');
  const menuItem = useMenuCurrentItem(pathname, menuConfig);
  const intl = useIntl();
  const label = menuItem?.title
    ? intl.formatMessage({ id: menuItem.title, defaultMessage: 'Title' })
    : 'Title';

  return <h1 className="text-xl font-medium leading-none text-gray-900">{label}</h1>;
};

export { ToolbarPageTitle };
