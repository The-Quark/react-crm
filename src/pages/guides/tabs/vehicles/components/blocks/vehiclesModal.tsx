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
import { IVehicleFormValues } from '@/api/post/postVehicle/types.ts';
import { postVehicle, putVehicle, getVehicles } from '@/api';
import { CircularProgress } from '@mui/material';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { mockTypes, mockStatus } from '@/lib/mocks.ts';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validateSchema = Yup.object().shape({
  plate_number: Yup.string().required('Plate number is required'),
  type: Yup.mixed<'car' | 'motorcycle' | 'truck' | 'bus'>()
    .oneOf(['car', 'motorcycle', 'truck', 'bus'], 'Invalid vehicle type')
    .required('Vehicle type is required'),
  brand: Yup.string().required('Brand is required'),
  model: Yup.string().required('Model is required'),
  status: Yup.mixed<'available' | 'rented' | 'maintenance'>()
    .oneOf(['available', 'rented', 'maintenance'], 'Invalid status')
    .required('Status is required'),
  avg_fuel_consumption: Yup.string().required('Average fuel consumption is required')
});

const VehicleModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<IVehicleFormValues>({
    plate_number: '',
    type: 'car',
    brand: '',
    model: '',
    status: 'available',
    avg_fuel_consumption: ''
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (id) {
      const fetchReq = async () => {
        setFormLoading(true);
        try {
          const reqData = await getVehicles(Number(id));
          const req = reqData.result[0];
          setInitialValues({
            plate_number: req.plate_number,
            type: req.type,
            brand: req.brand,
            model: req.model,
            status: req.status,
            avg_fuel_consumption: req.avg_fuel_consumption
          });
          setFormLoading(false);
        } catch (err) {
          console.error('Request error:', err);
        } finally {
          setFormLoading(false);
        }
      };

      fetchReq();
    }
  }, [id]);

  const formik = useFormik({
    initialValues,
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
        queryClient.invalidateQueries({ queryKey: ['vehicles'] });
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
            {formLoading ? (
              <div className="flex justify-center items-center p-5">
                <CircularProgress />
              </div>
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
                        {mockTypes.map((role) => (
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
                        {mockStatus.map((role) => (
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
