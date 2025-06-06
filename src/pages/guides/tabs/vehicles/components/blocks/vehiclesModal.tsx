import React, { FC, Fragment, useEffect, useState } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog.tsx';
import { KeenIcon } from '@/components';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { IVehicleFormValues } from '@/api/post/postGuides/postVehicle/types.ts';
import { getVehicles, postVehicle, putVehicle } from '@/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { VehiclesResponse } from '@/api/get/getGuides/getVehicles/types.ts';
import { VehicleStatus, VehicleType } from '@/api/enums';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const vehiclesTypes = [
  { id: 1, name: VehicleType.AUTO },
  { id: 2, name: VehicleType.VAN },
  { id: 3, name: VehicleType.MOTORBIKE }
];

const vehiclesStatus = [
  { id: 1, name: VehicleStatus.ONLINE },
  { id: 2, name: VehicleStatus.SERVICE }
];

const validateSchema = Yup.object().shape({
  plate_number: Yup.string().required('Plate number is required'),
  type: Yup.mixed<VehicleType>()
    .oneOf(Object.values(VehicleType), 'Invalid vehicle type')
    .required('Vehicle type is required'),
  brand: Yup.string().required('Brand is required'),
  model: Yup.string().required('Model is required'),
  status: Yup.mixed<VehicleStatus>()
    .oneOf(Object.values(VehicleStatus), 'Invalid status')
    .required('Status is required'),
  avg_fuel_consumption: Yup.string().required('Average fuel consumption is required')
});

const getInitialValues = (isEditMode: boolean, data: VehiclesResponse): IVehicleFormValues => {
  if (isEditMode && data?.result) {
    const vehicle = data.result[0];
    return {
      plate_number: vehicle.plate_number,
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      status: vehicle.status,
      avg_fuel_consumption: vehicle.avg_fuel_consumption
    };
  }
  return {
    plate_number: '',
    type: VehicleType.AUTO,
    brand: '',
    model: '',
    status: VehicleStatus.ONLINE,
    avg_fuel_consumption: ''
  };
};

const VehicleModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: vehicleData,
    isLoading: vehicleLoading,
    isError: vehicleIsError,
    error: vehicleError
  } = useQuery({
    queryKey: ['formVehicles', id],
    queryFn: () => getVehicles(Number(id)),
    enabled: !!id && open
  });

  const formik = useFormik({
    initialValues: getInitialValues(!!id, vehicleData as VehiclesResponse),
    enableReinitialize: true,
    validationSchema: validateSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (id) {
          await putVehicle(Number(id), values);
        } else {
          await postVehicle(values);
        }
        resetForm();
        onOpenChange();
        queryClient.invalidateQueries({ queryKey: ['guidesVehicles'] });
      } catch (err) {
        console.error('Error submitting:', err);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  const handleClose = () => {
    formik.resetForm();
    queryClient.removeQueries({ queryKey: ['formVehicles'] });
    onOpenChange();
  };

  return (
    <Fragment>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
          <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
            <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
              {id ? 'Update' : 'Create'}
            </DialogTitle>
            <DialogDescription></DialogDescription>
            <button
              className="btn btn-sm btn-icon btn-light btn-outline absolute top-0 end-0 me-3 mt-3 lg:me-3 shadow-default"
              data-modal-dismiss="true"
              onClick={handleClose}
            >
              <KeenIcon icon="cross" />
            </button>
          </DialogHeader>
          <DialogBody className="py-0 mb-5 ps-5 pe-3 me-3">
            {id && vehicleIsError && <SharedError error={vehicleError} />}
            {vehicleLoading ? (
              <SharedLoading simple />
            ) : (
              <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Plate number</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <input
                      className="input w-full"
                      type="text"
                      placeholder="Plate number"
                      {...formik.getFieldProps('plate_number')}
                    />
                    {formik.touched.plate_number && formik.errors.plate_number && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.plate_number}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Type</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <Select
                      value={formik.values.type?.toString()}
                      onValueChange={(value) => formik.setFieldValue('type', String(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehiclesTypes.map((role) => (
                          <SelectItem key={role.id} value={role.name.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formik.touched.type && formik.errors.type && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.type}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Brand</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <input
                      className="input w-full"
                      type="text"
                      placeholder="Brand"
                      {...formik.getFieldProps('brand')}
                    />
                    {formik.touched.brand && formik.errors.brand && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.brand}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Model</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <input
                      className="input w-full"
                      type="text"
                      placeholder="Model"
                      {...formik.getFieldProps('model')}
                    />
                    {formik.touched.model && formik.errors.model && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.model}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Status</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <Select
                      value={formik.values.status?.toString()}
                      onValueChange={(value) => formik.setFieldValue('status', String(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehiclesStatus.map((role) => (
                          <SelectItem key={role.id} value={role.name.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formik.touched.status && formik.errors.status && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Average fuel consumption</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <input
                      className="input w-full"
                      type="text"
                      placeholder="Average fuel consumption"
                      {...formik.getFieldProps('avg_fuel_consumption')}
                    />
                    {formik.touched.avg_fuel_consumption && formik.errors.avg_fuel_consumption && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.avg_fuel_consumption}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || formik.isSubmitting}
                  >
                    {loading ? 'Please wait...' : 'Save'}
                  </button>
                </div>
              </form>
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default VehicleModal;
