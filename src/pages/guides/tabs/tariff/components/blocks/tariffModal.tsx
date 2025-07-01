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
import { getCountries, getPackageTypes, getTariffs, postTariff, putTariff } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  SharedAutocomplete,
  SharedDecimalInput,
  SharedError,
  SharedLoading
} from '@/partials/sharedUI';
import { useIntl } from 'react-intl';
import { TariffsResponse } from '@/api/get/getGuides/getTariffs/types.ts';
import { ITariffFormValues } from '@/api/post/postGuides/postTariff/types.ts';
import { CACHE_TIME, decimalValidation } from '@/utils';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validationSchema = Yup.object().shape({
  country_id: Yup.string().required('VALIDATION.COUNTRY_REQUIRED'),
  package_type_id: Yup.string().required('VALIDATION.PACKAGE_TYPE_REQUIRED'),
  weight_from: decimalValidation.required('VALIDATION.WEIGHT_FROM_REQUIRED'),
  weight_to: decimalValidation.required('VALIDATION.WEIGHT_TO_REQUIRED'),
  price: decimalValidation.required('VALIDATION.PRICE_REQUIRED')
});

const getInitialValues = (isEditMode: boolean, data: TariffsResponse): ITariffFormValues => {
  if (isEditMode && data?.result) {
    return {
      country_id: data.result[0].country_id.toString() || '',
      package_type_id: data.result[0].package_type_id.toString() || '',
      weight_from: data.result[0].weight_from || '',
      weight_to: data.result[0].weight_to || '',
      price: data.result[0].price || ''
    };
  }
  return {
    country_id: '',
    package_type_id: '',
    weight_from: '',
    weight_to: '',
    price: ''
  };
};

const TariffModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(false);
  const [packageTypeTerm, setPackageTerm] = useState('');
  const [countryTerm, setCountryTerm] = useState('');

  const {
    data: tariffData,
    isLoading: tariffLoading,
    isError: tariffIsError,
    error: tariffError
  } = useQuery({
    queryKey: ['formTariff', id],
    queryFn: () => getTariffs({ id: Number(id) }),
    enabled: !!id && open
  });

  const {
    data: countriesData,
    isLoading: countriesLoading,
    isError: countriesIsError,
    error: countriesError
  } = useQuery({
    queryKey: ['guidesTariffCountries'],
    queryFn: () => getCountries('id,iso2,name'),
    staleTime: Infinity
  });

  const {
    data: packageData,
    isLoading: packageLoading,
    isError: packageIsError,
    error: packageError
  } = useQuery({
    queryKey: ['guidesTariffPackageTypes', packageTypeTerm],
    queryFn: () => getPackageTypes({ code: packageTypeTerm }),
    staleTime: CACHE_TIME
  });

  const formik = useFormik({
    initialValues: getInitialValues(!!id, tariffData as TariffsResponse),
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (id) {
          await putTariff(Number(id), values);
        } else {
          await postTariff(values);
        }
        resetForm();
        onOpenChange();
        queryClient.invalidateQueries({ queryKey: ['guidesTariffs'] });
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
    queryClient.removeQueries({ queryKey: ['formTariff'] });
    onOpenChange();
  };

  return (
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
          {id && tariffIsError && <SharedError error={tariffError} />}
          {countriesIsError && <SharedError error={countriesError} />}
          {packageIsError && <SharedError error={packageError} />}
          {tariffLoading ? (
            <SharedLoading simple />
          ) : (
            <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
              <SharedAutocomplete
                label={formatMessage({ id: 'SYSTEM.COUNTRY' })}
                value={formik.values.country_id}
                options={countriesData?.data ?? []}
                placeholder={formatMessage({ id: 'SYSTEM.SELECT_COUNTRY' })}
                searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_COUNTRY' })}
                onChange={(val) => {
                  formik.setFieldValue('country_id', val);
                }}
                error={formik.errors.country_id as string}
                touched={formik.touched.country_id}
                searchTerm={countryTerm}
                onSearchTermChange={setCountryTerm}
                loading={countriesLoading}
              />
              <SharedAutocomplete
                label={formatMessage({ id: 'SYSTEM.PACKAGE_TYPE' })}
                value={formik.values.package_type_id}
                options={(packageData?.result ?? []).map((pt) => ({
                  id: pt.id,
                  name: pt.code,
                  value: pt.id
                }))}
                placeholder={formatMessage({ id: 'SYSTEM.SELECT_PACKAGE_TYPE' })}
                searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_PACKAGE_TYPE' })}
                onChange={(val) => {
                  formik.setFieldValue('package_type_id', val);
                }}
                error={formik.errors.package_type_id as string}
                touched={formik.touched.package_type_id}
                searchTerm={packageTypeTerm}
                onSearchTermChange={setPackageTerm}
                loading={packageLoading}
              />
              <SharedDecimalInput
                name="weight_from"
                label={formatMessage({ id: 'SYSTEM.WEIGHT_FROM' })}
                formik={formik}
              />
              <SharedDecimalInput
                name="weight_to"
                label={formatMessage({ id: 'SYSTEM.WEIGHT_TO' })}
                formik={formik}
              />
              <SharedDecimalInput
                name="price"
                label={formatMessage({ id: 'SYSTEM.PRICE' })}
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

export default TariffModal;
