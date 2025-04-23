import React, { FC, useState } from 'react';
import { DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import VehicleModal from '@/pages/guides/tabs/vehicles/components/blocks/vehiclesModal.tsx';

interface Props {
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export const VehiclesToolbar: FC<Props> = ({ setReload }) => {
  const { table } = useDataGrid();
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const handleClose = () => {
    setVehicleModalOpen(false);
  };
  const handleOpen = () => {
    setVehicleModalOpen(true);
  };
  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Vehicles</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative">
          <KeenIcon
            icon="magnifier"
            className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
          />
          <input
            type="text"
            placeholder="Search plate number"
            className="input input-sm ps-8"
            value={(table.getColumn('plate number')?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn('plate number')?.setFilterValue(e.target.value)}
          />
        </div>
        <DataGridColumnVisibility table={table} />
        <button className="btn btn-sm btn-primary" onClick={handleOpen}>
          New Vehicle
        </button>
      </div>
      <VehicleModal open={vehicleModalOpen} onOpenChange={handleClose} setReload={setReload} />
    </div>
  );
};
