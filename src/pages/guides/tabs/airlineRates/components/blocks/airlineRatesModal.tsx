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
import { SharedAutocomplete, SharedError, SharedInput, SharedLoading } from '@/partials/sharedUI';
import { AirlineResponse } from '@/api/get/getAirlines/types.ts';
import { IAirlineFormValues } from '@/api/post/postAirline/types.ts';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validateSchema = Yup.object({
  code: Yup.string().required('Code is required').max(10, 'Maximum length is 10 characters'),
  name: Yup.string().required('Name is required'),
  country: Yup.string().required('Country is required'),
  is_active: Yup.boolean().required()
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

export const AirlineRatesModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const {
    data: airlinesData,
    isLoading: airlinesLoading,
    isError: airlinesIsError,
    error: airlinesError
  } = useQuery({
    queryKey: ['formAirline', id],
    queryFn: () => getAirlines(Number(id)),
    enabled: !!id
  });

  const {
    data: countriesData,
    isLoading: countriesLoading,
    isError: countriesIsError,
    error: countriesError
  } = useQuery({
    queryKey: ['guidesAirlinesCountries'],
    queryFn: () => getCountries('id,iso2,name')
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
          {countriesIsError && <SharedError error={countriesError} />}
          {id && airlinesIsError && <SharedError error={airlinesError} />}
          {countriesLoading || (id && airlinesLoading) ? (
            <SharedLoading />
          ) : (
            <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
              <SharedInput name="name" label="Name" formik={formik} />
              <SharedInput name="code" label="Code" formik={formik} />
              <SharedAutocomplete
                label="Country"
                value={formik.values.country}
                options={countriesData?.data ?? []}
                placeholder="Select country"
                searchPlaceholder="Search country"
                onChange={(val) => {
                  formik.setFieldValue('country', val);
                }}
                error={formik.errors.country as string}
                touched={formik.touched.country}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
              />
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
  );
};
