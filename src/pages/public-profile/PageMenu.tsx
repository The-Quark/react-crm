import { useMenus } from '@/providers';
import { NavbarMenu } from '@/partials/menu/NavbarMenu';

const PageMenu = () => {
  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig('primary');
  const accountMenuConfig = menuConfig?.['3']?.children;

  if (accountMenuConfig) {
    return <NavbarMenu items={accountMenuConfig} />;
  } else {
    return <>test</>;
  }
};

export { PageMenu };
