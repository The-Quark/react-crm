import React, { FC, useState } from 'react';
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
import { ICurrencyFormValues } from '@/api/post/postGuides/postCurrency/types.ts';
import { getCurrencies, postCurrency, putCurrency } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CurrencyResponse } from '@/api/get/getGuides/getCurrencies/types.ts';
import {
  SharedCheckBox,
  SharedDecimalInput,
  SharedError,
  SharedInput,
  SharedLoading
} from '@/partials/sharedUI';
import { decimalValidation } from '@/utils';
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validateSchema = Yup.object({
  code: Yup.string().required('VALIDATION.CODE_REQUIRED'),
  name: Yup.string().required('VALIDATION.NAME_REQUIRED'),
  symbol: Yup.string().required('Symbol is required').length(1, 'VALIDATION.SYMBOL_LENGTH'),
  rate_to_base: decimalValidation.required('VALIDATION.RATE_TO_BASE_REQUIRED'),
  is_base: Yup.boolean().required(),
  is_active: Yup.boolean().required()
});

const getInitialValues = (
  isEditMode: boolean,
  currencyData: CurrencyResponse
): ICurrencyFormValues => {
  if (isEditMode && currencyData?.result) {
    const data = currencyData.result[0];
    return {
      code: data.code || '',
      name: data.name || '',
      symbol: data.symbol || '',
      is_base: data.is_base || false,
      rate_to_base: data.rate_to_base || 0,
      is_active: data.is_active || false
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
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(false);

  const {
    data: currencyData,
    isLoading: currencyLoading,
    isError: currencyIsError,
    error: currencyError
  } = useQuery({
    queryKey: ['formCurrency', id],
    queryFn: () => getCurrencies({ id: Number(id) }),
    enabled: !!id && open
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
            {formatMessage({ id: id ? 'SYSTEM.UPDATE' : 'SYSTEM.CREATE' })}
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
            <SharedLoading simple />
          ) : (
            <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
              <SharedInput
                name="name"
                label={formatMessage({ id: 'SYSTEM.NAME' })}
                formik={formik}
              />
              <SharedInput
                name="symbol"
                label={formatMessage({ id: 'SYSTEM.SYMBOL' })}
                formik={formik}
              />
              <SharedInput
                name="code"
                label={formatMessage({ id: 'SYSTEM.CODE' })}
                formik={formik}
              />
              <SharedDecimalInput
                name="rate_to_base"
                label={formatMessage({ id: 'SYSTEM.RATE_TO_BASE' })}
                formik={formik}
              />
              <SharedCheckBox
                name="is_base"
                label={formatMessage({ id: 'SYSTEM.BASE' })}
                formik={formik}
              />
              <SharedCheckBox
                name="is_active"
                label={formatMessage({ id: 'SYSTEM.ACTIVE' })}
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
  );
};

export default CurrenciesModal;
