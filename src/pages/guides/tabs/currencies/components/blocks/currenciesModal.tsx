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
import { ICurrencyFormValues } from '@/api/post/postCurrency/types.ts';
import { getCurrencies, postCurrency, putCurrency } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CurrencyResponse } from '@/api/get/getCurrencies/types.ts';
import { SharedError, SharedInput, SharedLoading } from '@/partials/sharedUI';

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

const getInitialValues = (
  isEditMode: boolean,
  currencyData: CurrencyResponse
): ICurrencyFormValues => {
  if (isEditMode && currencyData?.result) {
    return {
      code: currencyData.result[0].code || '',
      name: currencyData.result[0].name || '',
      symbol: currencyData.result[0].symbol || '',
      is_base: currencyData.result[0].is_base || false,
      rate_to_base: currencyData.result[0].rate_to_base || 0,
      is_active: currencyData.result[0].is_active || false
    };
  }
  return {
    code: '',
    name: '',
    symbol: '',
    is_base: false,
    rate_to_base: 0,
    is_active: false
  };
};

const CurrenciesModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: currencyData,
    isLoading: currencyLoading,
    isError: currencyIsError,
    error: currencyError
  } = useQuery({
    queryKey: ['formCurrency', id],
    queryFn: () => getCurrencies(Number(id)),
    enabled: !!id
  });

  const formik = useFormik({
    initialValues: getInitialValues(!!id, currencyData as CurrencyResponse),
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
        queryClient.invalidateQueries({ queryKey: ['guidesCurrencies'] });
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
    queryClient.removeQueries({ queryKey: ['formCurrency'] });
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
            {id && currencyIsError && <SharedError error={currencyError} />}
            {id && currencyLoading ? (
              <SharedLoading />
            ) : (
              <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
                <SharedInput name="name" label="Name" formik={formik} />
                <SharedInput name="symbol" label="Symbol" formik={formik} />
                <SharedInput name="code" label="Code" formik={formik} />
                <SharedInput
                  name="rate_to_base"
                  label="Rate to base"
                  type="number"
                  formik={formik}
                />

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
