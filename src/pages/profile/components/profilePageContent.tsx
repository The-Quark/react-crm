import { Contributors, Tags } from '@/pages/public-profile/profiles/default';
import {
  ProfilePageContentActivity,
  ProfilePageContentApiCredentials,
  ProfilePageContentAttributes,
  ProfilePageContentDeals,
  ProfilePageContentGeneralInfo,
  ProfilePageContentRecentInvoices
} from './blocks';

export const ProfilePageContent = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7.5">
      <div className="col-span-1">
        <div className="grid gap-5 lg:gap-7.5">
          <ProfilePageContentGeneralInfo />

          <ProfilePageContentAttributes />

          <ProfilePageContentApiCredentials />

          <Tags title="Skills" />
        </div>
      </div>
      <div className="col-span-2">
        <div className="flex flex-col gap-5 lg:gap-7.5">
          <div className="flex flex-col gap-5 lg:gap-7.5">
            <ProfilePageContentDeals />

            <ProfilePageContentActivity />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7.5">
              <Contributors />

              <ProfilePageContentRecentInvoices />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
