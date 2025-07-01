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
import { getAirlines, putAirline, postAirline, getCountries } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  SharedAutocomplete,
  SharedCheckBox,
  SharedError,
  SharedInput,
  SharedLoading
} from '@/partials/sharedUI';
import { AirlineResponse } from '@/api/get/getGuides/getAirlines/types.ts';
import { IAirlineFormValues } from '@/api/post/postGuides/postAirline/types.ts';
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validateSchema = Yup.object({
  code: Yup.string().required('VALIDATION.CODE_REQUIRED').max(10, 'VALIDATION.CODE_MAX'),
  name: Yup.string().required('VALIDATION.NAME_REQUIRED'),
  country: Yup.string().required('VALIDATION.COUNTRY_REQUIRED'),
  is_active: Yup.boolean().required('VALIDATION.ACTIVE_STATUS_REQUIRED')
});

const getInitialValues = (
  isEditMode: boolean,
  airlineData: AirlineResponse
): IAirlineFormValues => {
  if (isEditMode && airlineData?.result) {
    return {
      name: airlineData.result[0].name || '',
      code: airlineData.result[0].code || '',
      country: airlineData.result[0].country?.id?.toString() || '',
      is_active: airlineData.result[0].is_active || false
    };
  }
  return {
    name: '',
    code: '',
    country: '',
    is_active: false
  };
};

const AirlineModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();
  const {
    data: airlinesData,
    isLoading: airlinesLoading,
    isError: airlinesIsError,
    error: airlinesError
  } = useQuery({
    queryKey: ['formAirline', id],
    queryFn: () => getAirlines({ id: Number(id) }),
    enabled: !!id && open
  });

  const {
    data: countriesData,
    isLoading: countriesLoading,
    isError: countriesIsError,
    error: countriesError
  } = useQuery({
    queryKey: ['guidesAirlinesCountries'],
    queryFn: () => getCountries('id,iso2,name'),
    staleTime: Infinity,
    refetchOnWindowFocus: false
  });

  const formik = useFormik({
    initialValues: getInitialValues(!!id, airlinesData as AirlineResponse),
    enableReinitialize: true,
    validationSchema: validateSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (id) {
          await putAirline(Number(id), values);
        } else {
          await postAirline(values);
        }
        resetForm();
        setSearchTerm('');
        onOpenChange();
        queryClient.invalidateQueries({ queryKey: ['guidesAirlines'] });
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
    queryClient.removeQueries({ queryKey: ['formAirline'] });
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
          {countriesIsError && <SharedError error={countriesError} />}
          {id && airlinesIsError && <SharedError error={airlinesError} />}
          {countriesLoading || (id && airlinesLoading) ? (
            <SharedLoading simple />
          ) : (
            <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
              <SharedInput
                name="name"
                label={formatMessage({ id: 'SYSTEM.NAME' })}
                formik={formik}
              />
              <SharedInput
                name="code"
                label={formatMessage({ id: 'SYSTEM.CODE' })}
                formik={formik}
              />
              <SharedAutocomplete
                label={formatMessage({ id: 'SYSTEM.COUNTRY' })}
                value={formik.values.country}
                options={countriesData?.data ?? []}
                placeholder={formatMessage({ id: 'SYSTEM.SELECT_COUNTRY' })}
                searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_COUNTRY' })}
                onChange={(val) => {
                  formik.setFieldValue('country', val);
                }}
                error={formik.errors.country as string}
                touched={formik.touched.country}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
              />
              <SharedCheckBox
                formik={formik}
                name="is_active"
                label={formatMessage({ id: 'SYSTEM.ACTIVE' })}
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

export default AirlineModal;
