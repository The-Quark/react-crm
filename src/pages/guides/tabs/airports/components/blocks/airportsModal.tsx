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
import { getCountries, getAirports, putAirport, postAirport } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SharedAutocomplete, SharedError, SharedInput, SharedLoading } from '@/partials/sharedUI';
import { useIntl } from 'react-intl';
import { Airport } from '@/api/get/getGuides/getAirports/types.ts';
import { IAirportFormValues } from '@/api/post/postGuides/postAirport/types.ts';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validateSchema = Yup.object({
  code: Yup.string().required('VALIDATION.CODE_REQUIRED'),
  name: Yup.string().required('VALIDATION.NAME_REQUIRED'),
  country_id: Yup.string()
});

const getInitialValues = (isEditMode: boolean, airportData: Airport): IAirportFormValues => {
  if (isEditMode && airportData) {
    return {
      name: airportData.name || '',
      code: airportData.code || '',
      country_id: airportData?.country_id?.toString() || ''
    };
  }
  return {
    name: '',
    code: '',
    country_id: ''
  };
};

const AirportsModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();
  const {
    data: airportsData,
    isLoading: airportsLoading,
    isError: airportsIsError,
    error: airportsError
  } = useQuery({
    queryKey: ['formAirport', id],
    queryFn: () => getAirports({ id: Number(id) }),
    enabled: !!id && open
  });

  const {
    data: countriesData,
    isLoading: countriesLoading,
    isError: countriesIsError,
    error: countriesError
  } = useQuery({
    queryKey: ['guidesAirportsCountries'],
    queryFn: () => getCountries('id,iso2,name'),
    staleTime: Infinity,
    refetchOnWindowFocus: false
  });

  const formik = useFormik({
    initialValues: getInitialValues(!!id, airportsData?.result[0] as Airport),
    enableReinitialize: true,
    validationSchema: validateSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (id) {
          await putAirport(Number(id), values);
        } else {
          await postAirport(values);
        }
        resetForm();
        setSearchTerm('');
        onOpenChange();
        queryClient.invalidateQueries({ queryKey: ['guidesAirports'] });
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
          {id && airportsIsError && <SharedError error={airportsError} />}
          {countriesLoading || (id && airportsLoading) ? (
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
                value={formik.values.country_id}
                options={countriesData?.data ?? []}
                placeholder={formatMessage({ id: 'SYSTEM.SELECT_COUNTRY' })}
                searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_COUNTRY' })}
                onChange={(val) => {
                  formik.setFieldValue('country_id', val);
                }}
                error={formik.errors.country_id as string}
                touched={formik.touched.country_id}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
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

export default AirportsModal;
