import React, { FC, Fragment, useState } from 'react';
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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { VehiclesResponse } from '@/api/get/getGuides/getVehicles/types.ts';
import { VehicleStatus, VehicleType } from '@/api/enums';
import { SharedError, SharedInput, SharedLoading, SharedSelect } from '@/partials/sharedUI';
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number | null;
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
  plate_number: Yup.string().required('VALIDATION.PLATE_NUMBER_REQUIRED'),
  type: Yup.mixed<VehicleType>()
    .oneOf(Object.values(VehicleType), 'VALIDATION.VEHICLE_TYPE_INVALID')
    .required('VALIDATION.VEHICLE_TYPE_REQUIRED'),
  brand: Yup.string().required('VALIDATION.BRAND_REQUIRED'),
  model: Yup.string().required('VALIDATION.MODEL_REQUIRED'),
  status: Yup.mixed<VehicleStatus>()
    .oneOf(Object.values(VehicleStatus), 'VALIDATION.VEHICLE_STATUS_INVALID')
    .required('VALIDATION.VEHICLE_STATUS_REQUIRED'),
  avg_fuel_consumption: Yup.string().required('VALIDATION.AVG_FUEL_CONSUMPTION_REQUIRED')
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

const VehiclesModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(false);

  const {
    data: vehicleData,
    isLoading: vehicleLoading,
    isError: vehicleIsError,
    error: vehicleError
  } = useQuery({
    queryKey: ['formVehicles', id],
    queryFn: () => getVehicles({ id: Number(id) }),
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
              {formatMessage({ id: id ? 'SYSTEM.EDIT' : 'SYSTEM.CREATE' })}
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
                <SharedInput
                  name="plate_number"
                  label={formatMessage({ id: 'SYSTEM.PLATE_NUMBER' })}
                  formik={formik}
                />
                <SharedSelect
                  name="type"
                  label={formatMessage({ id: 'SYSTEM.TYPE' })}
                  formik={formik}
                  options={vehiclesTypes.map((role) => ({
                    label: role.name,
                    value: role.name
                  }))}
                />
                <SharedInput
                  name="brand"
                  label={formatMessage({ id: 'SYSTEM.BRAND' })}
                  formik={formik}
                />
                <SharedInput
                  name="model"
                  label={formatMessage({ id: 'SYSTEM.MODEL' })}
                  formik={formik}
                />

                <SharedSelect
                  name="status"
                  label={formatMessage({ id: 'SYSTEM.SELECT_STATUS' })}
                  formik={formik}
                  options={vehiclesStatus.map((role) => ({
                    label: role.name,
                    value: role.name
                  }))}
                />

                <SharedInput
                  name="avg_fuel_consumption"
                  label={formatMessage({ id: 'SYSTEM.AVERAGE_FUEL_CONSUMPTION' })}
                  formik={formik}
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || formik.isSubmitting}
                  >
                    {formatMessage({ id: loading ? 'SYSTEM.PLEASE_WAIT' : 'SYSTEM.SAVE' })}
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

export default VehiclesModal;
