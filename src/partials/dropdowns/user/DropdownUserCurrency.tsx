import { FormattedMessage } from 'react-intl';
import { KeenIcon } from '@/components';
import { MenuItem, MenuLink, MenuTitle, MenuIcon, MenuBadge, MenuSub } from '@/components/menu';
import clsx from 'clsx';
import { useLanguage } from '@/i18n';
import { CURRENCIES } from '@/utils';
import { useCurrency } from '@/providers';

interface IDropdownUserCurrenciesProps {
  menuItemRef: any;
}

type Currency = (typeof CURRENCIES)[number];

const DropdownUserCurrency = ({ menuItemRef }: IDropdownUserCurrenciesProps) => {
  const { isRTL } = useLanguage();
  const { currency: currentCurrency, setCurrency } = useCurrency();

  const handleCurrency = (currency: Currency) => {
    setCurrency(currency);
    if (menuItemRef.current) {
      menuItemRef.current.hide();
    }
  };

  const buildItems = () => {
    return CURRENCIES.map((item) => (
      <MenuItem
        key={item.code}
        className={clsx(item.code === currentCurrency.code && 'active')}
        onClick={() => handleCurrency(item)}
      >
        <MenuLink className="h-10">
          <MenuIcon>
            <img src={item.flag} className="inline-block size-4 rounded-full" alt={item.label} />
          </MenuIcon>
          <MenuTitle>{item.label}</MenuTitle>
          {item.code === currentCurrency.code && (
            <MenuBadge>
              <KeenIcon icon="check-circle" style="solid" className="text-success text-base" />
            </MenuBadge>
          )}
        </MenuLink>
      </MenuItem>
    ));
  };

  return (
    <MenuItem
      toggle="dropdown"
      trigger="hover"
      dropdownProps={{
        placement: isRTL() ? 'left-start' : 'right-start',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: isRTL() ? [-10, 0] : [10, 0]
            }
          }
        ]
      }}
    >
      <MenuLink>
        <MenuIcon>
          <KeenIcon icon="dollar" />
        </MenuIcon>
        <MenuTitle>
          <FormattedMessage id="USER.MENU.CURRENCY" />
        </MenuTitle>
        <div className="flex items-center gap-1.5 rounded-md border border-gray-300 text-gray-600 p-1.5 text-2xs font-medium shrink-0">
          {currentCurrency.label}
          <img
            src={currentCurrency.flag}
            className="inline-block size-3.5 rounded-full"
            alt={currentCurrency.label}
          />
        </div>
      </MenuLink>
      <MenuSub className="menu-default light:border-gray-300 w-[190px]">{buildItems()}</MenuSub>
    </MenuItem>
  );
};

export { DropdownUserCurrency };
