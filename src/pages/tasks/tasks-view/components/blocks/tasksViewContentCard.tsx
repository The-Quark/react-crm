import { FC } from 'react';
import { Task } from '@/api/get/getTask/types.ts';

interface IGeneralSettingsProps {
  task: Task | null;
}

export const TasksViewContentCard: FC<IGeneralSettingsProps> = ({ task }) => {
  return (
    <div className="card pb-2.5">
      <div className="card-header" id="general_settings">
        <h3 className="card-title">Task</h3>
      </div>
      <div className="card-body grid gap-5">
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Company Name</label>
          <div className="flex columns-1 w-full flex-wrap">{task?.title}</div>
        </div>
      </div>
    </div>
  );
};
