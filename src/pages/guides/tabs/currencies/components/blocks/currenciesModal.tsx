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
import { CircularProgress } from '@mui/material';
import { ICurrencyFormValues } from '@/api/post/postCurrency/types.ts';
import { getCurrencies, postCurrency, putCurrency } from '@/api';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validateSchema = Yup.object({
  code: Yup.string().required('Code is required').max(10, 'Maximum length is 10 characters'),
  name: Yup.string().required('Name is required').max(50, 'Maximum length is 50 characters'),
  symbol: Yup.string().required('Symbol is required').length(1, 'Symbol should be 1 character'),
  rate_to_base: Yup.number()
    .required('Exchange rate is required')
    .min(0, 'Exchange rate cannot be negative')
    .test(
      'is-two-decimal',
      'The rate to base field must have exactly 2 decimal places.',
      (value) => {
        if (value === undefined || value === null) return false;
        const decimalPart = value.toString().split('.')[1];
        return decimalPart?.length === 2;
      }
    ),
  is_base: Yup.boolean().required(),
  is_active: Yup.boolean().required()
});

const CurrenciesModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<ICurrencyFormValues>({
    code: '',
    name: '',
    symbol: '',
    is_base: false,
    rate_to_base: 0,
    is_active: true
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (id) {
      const fetchReq = async () => {
        setFormLoading(true);
        try {
          const reqData = await getCurrencies(Number(id));
          const req = reqData.result[0];
          setInitialValues({
            code: req.code,
            name: req.name,
            symbol: req.symbol,
            rate_to_base: req.rate_to_base,
            is_base: req.is_base,
            is_active: req.is_active
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
          await putCurrency(Number(id), values);
        } else {
          await postCurrency(values);
        }
        resetForm();
        onOpenChange();
        queryClient.invalidateQueries({ queryKey: ['currencies'] });
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
                  <label className="form-label max-w-56">Name</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <input
                      className="input w-full"
                      type="text"
                      placeholder="Name"
                      {...formik.getFieldProps('name')}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Symbol</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <input
                      className="input w-full"
                      type="text"
                      placeholder="Symbol"
                      {...formik.getFieldProps('symbol')}
                    />
                    {formik.touched.symbol && formik.errors.symbol && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.symbol}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Code</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <input
                      className="input w-full"
                      type="text"
                      placeholder="Code"
                      {...formik.getFieldProps('code')}
                    />
                    {formik.touched.code && formik.errors.code && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.code}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Rate to base</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <input
                      className="input w-full"
                      type="number"
                      placeholder="Rate to base"
                      {...formik.getFieldProps('rate_to_base')}
                    />
                    {formik.touched.rate_to_base && formik.errors.rate_to_base && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.rate_to_base}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex  flex-wrap items-center lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Base</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <div className="flex items-center gap-5">
                      <label className="checkbox-group flex items-center gap-2">
                        <input
                          className="checkbox"
                          type="checkbox"
                          name="is_base"
                          checked={formik.values.is_base}
                          onChange={(e) => formik.setFieldValue('is_base', e.target.checked)}
                        />
                      </label>
                    </div>
                    {formik.touched.is_base && formik.errors.is_base && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.is_base}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex  flex-wrap items-center lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Active</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <div className="flex items-center gap-5">
                      <label className="checkbox-group flex items-center gap-2">
                        <input
                          className="checkbox"
                          type="checkbox"
                          name="is_active"
                          checked={formik.values.is_active}
                          onChange={(e) => formik.setFieldValue('is_active', e.target.checked)}
                        />
                      </label>
                    </div>
                    {formik.touched.is_active && formik.errors.is_active && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formik.errors.is_active}
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

export default CurrenciesModal;
