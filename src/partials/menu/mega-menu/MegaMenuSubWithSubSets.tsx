import { TMenuConfig, MenuSub } from '@/components/menu';
import { MegaMenuSubDefault } from './components';

const MegaMenuSubWithSubSets = (items: TMenuConfig, itemIndex: number) => {
  const publicProfilesItem = items[itemIndex];

  return (
    <MenuSub className="w-full gap-0 lg:max-w-[300px]">
      <div className="pt-4 pb-2 lg:p-3">
        <div className="grid lg:grid-cols-1 gap-5 lg:gap-1">
          <div className="menu menu-default menu-fit flex-col">
            <div className="flex flex-col">
              {publicProfilesItem.children && MegaMenuSubDefault(publicProfilesItem.children)}
            </div>
          </div>
        </div>
      </div>
    </MenuSub>
  );
};

export { MegaMenuSubWithSubSets };
