import { Highlights } from './blocks/Highlights.tsx';
import { Contributions, MediaUploads } from '@/pages/public-profile/profiles/default';

export const DashboardContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="grid lg:grid-cols-3 gap-y-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <Contributions title="Assistance" />
        </div>

        <div className="lg:col-span-2">
          <MediaUploads />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <Highlights limit={3} />
        </div>

        <div className="lg:col-span-2">test</div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">test</div>

        <div className="lg:col-span-2">test</div>
      </div>
    </div>
  );
};
