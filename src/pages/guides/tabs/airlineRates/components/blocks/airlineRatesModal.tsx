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
import {
  getCountries,
  getAirlineRates,
  putAirlineRate,
  postAirlineRate,
  getAirlines,
  getCitiesByCountryCode,
  getCurrencies
} from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  SharedAutocomplete,
  SharedDecimalInput,
  SharedError,
  SharedLoading
} from '@/partials/sharedUI';
import { IAirlineRatesResponse } from '@/api/get/getGuides/getAirlineRates/types.ts';
import { IAirlineRateFormValues } from '@/api/post/postGuides/postAirlineRate/types.ts';
import { decimalValidation } from '@/utils';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validateSchema = Yup.object({
  airline_id: Yup.string().required('Airline is required'),
  from_country_id: Yup.string().required('Departure country is required'),
  to_country_id: Yup.string().required('Destination country is required'),
  from_city_id: Yup.string().required('Departure city is required'),
  to_city_id: Yup.string().required('Destination city is required'),
  currency: Yup.string().required('Currency is required'),
  price_per_kg: decimalValidation.required('Price per kg is required'),
  min_weight: decimalValidation.required('Minimum weight is required'),
  max_weight: decimalValidation
    .test('moreThan', 'Maximum weight must be greater than minimum weight', function (value) {
      const { min_weight } = this.parent;
      if (value === undefined || min_weight === undefined) return true;
      return Number(value) > Number(min_weight);
    })
    .required('Maximum weight is required'),
  is_active: Yup.boolean()
});

const getInitialValues = (
  isEditMode: boolean,
  airlineRatesData: IAirlineRatesResponse
): IAirlineRateFormValues => {
  if (isEditMode && airlineRatesData?.result) {
    const rate = airlineRatesData.result[0];
    return {
      airline_id: String(rate.airline_id) || '',
      from_country_id: String(rate.from_city.country_id) || '',
      from_city_id: String(rate.from_city_id) || '',
      to_country_id: String(rate.to_city.country_id) || '',
      to_city_id: String(rate.to_city_id) || '',
      currency: String(rate.currency?.id) || '',
      price_per_kg: rate.price_per_kg || '',
      min_weight: rate.min_weight || '',
      max_weight: rate.max_weight || '',
      is_active: rate.is_active || false
    };
  }
  return {
    airline_id: '',
    from_country_id: '',
    from_city_id: '',
    to_country_id: '',
    to_city_id: '',
    currency: '',
    price_per_kg: '',
    min_weight: '',
    max_weight: '',
    is_active: false
  };
};

export const AirlineRatesModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const [loading, setLoading] = useState(false);
  const [searchAirlineTerm, setSearchAirlineTerm] = useState('');
  const [searchFromCountryTerm, setSearchFromCountryTerm] = useState('');
  const [searchFromCityTerm, setSearchFromCityTerm] = useState('');
  const [searchToCountryTerm, setSearchToCountryTerm] = useState('');
  const [searchToCityTerm, setSearchToCityTerm] = useState('');
  const [searchCurrencyTerm, setSearchCurrencyTerm] = useState('');
  const queryClient = useQueryClient();

  const {
    data: airlineRateData,
    isLoading: airlineRateLoading,
    isError: airlineRateIsError,
    error: airlineRateError
  } = useQuery({
    queryKey: ['formAirlineRate', id],
    queryFn: () => getAirlineRates({ id: Number(id) }),
    enabled: !!id && open
  });

  const {
    data: airlineData,
    isLoading: airlineLoading,
    isError: airlineIsError,
    error: airlineError
  } = useQuery({
    queryKey: ['airlineRatesAirline'],
    queryFn: () => getAirlines({}),
    staleTime: 1000 * 60 * 2,
    enabled: open
  });

  const {
    data: countriesData,
    isLoading: countriesLoading,
    isError: countriesIsError,
    error: countriesError
  } = useQuery({
    queryKey: ['guidesAirlineRatesCountries'],
    queryFn: () => getCountries('id,iso2,name'),
    staleTime: Infinity,
    enabled: open
  });

  const {
    data: currenciesData,
    isLoading: currenciesLoading,
    isError: currenciesIsError,
    error: currenciesError
  } = useQuery({
    queryKey: ['airlineRatesCurrencies'],
    queryFn: () => getCurrencies({}),
    staleTime: 1000 * 60 * 2,
    enabled: open
  });

  const formik = useFormik({
    initialValues: getInitialValues(!!id, airlineRateData as IAirlineRatesResponse),
    enableReinitialize: true,
    validationSchema: validateSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (id) {
          await putAirlineRate(Number(id), values);
        } else {
          await postAirlineRate(values);
        }
        resetForm();
        onOpenChange();
        queryClient.invalidateQueries({ queryKey: ['guidesAirlineRates'] });
      } catch (err) {
        console.error('Error submitting:', err);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  const {
    data: fromCitiesData,
    isLoading: fromCitiesLoading,
    isError: fromCitiesIsError,
    error: fromCitiesError
  } = useQuery({
    queryKey: [
      'cities-from',
      formik.values.from_country_id || airlineRateData?.result[0]?.from_city.country_id
    ],
    queryFn: () =>
      getCitiesByCountryCode(
        (
          formik.values.from_country_id || String(airlineRateData?.result[0]?.from_city.country_id)
        ).toString(),
        'id'
      ),
    enabled:
      open &&
      (!!formik.values.from_country_id || !!airlineRateData?.result[0]?.from_city.country_id)
  });

  const {
    data: toCitiesData,
    isLoading: toCitiesLoading,
    isError: toCitiesIsError,
    error: toCitiesError
  } = useQuery({
    queryKey: [
      'cities-to',
      formik.values.to_country_id || airlineRateData?.result[0]?.to_city.country_id
    ],
    queryFn: () =>
      getCitiesByCountryCode(
        (
          formik.values.to_country_id || String(airlineRateData?.result[0]?.to_city.country_id)
        ).toString(),
        'id'
      ),
    enabled:
      open && (!!formik.values.to_country_id || !!airlineRateData?.result[0]?.to_city.country_id)
  });

  const handleClose = () => {
    formik.resetForm({
      values: {
        airline_id: '',
        from_country_id: '',
        from_city_id: '',
        to_country_id: '',
        to_city_id: '',
        currency: '',
        price_per_kg: '',
        min_weight: '',
        max_weight: '',
        is_active: false
      }
    });
    queryClient.removeQueries({ queryKey: ['formAirlineRate'] });
    onOpenChange();
  };

  const isFormLoading = id
    ? airlineRateLoading ||
      airlineLoading ||
      countriesLoading ||
      currenciesLoading ||
      fromCitiesLoading ||
      toCitiesLoading
    : airlineLoading || countriesLoading || currenciesLoading;

  const isFormError = id
    ? airlineRateIsError ||
      airlineIsError ||
      countriesIsError ||
      currenciesIsError ||
      fromCitiesIsError ||
      toCitiesIsError
    : airlineIsError || countriesIsError || currenciesIsError;

  const formErrors = [
    airlineRateError,
    airlineError,
    countriesError,
    fromCitiesError,
    toCitiesError,
    currenciesError
  ].filter((error) => error !== null);

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
          {isFormError &&
            formErrors.map((error, index) => <SharedError key={index} error={error} />)}
          {isFormLoading ? (
            <SharedLoading simple />
          ) : (
            <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
              <SharedAutocomplete
                label="Airline"
                value={formik.values.airline_id}
                options={airlineData?.result ?? []}
                placeholder="Select airline"
                searchPlaceholder="Search airline"
                onChange={(val) => {
                  formik.setFieldValue('airline_id', val);
                }}
                error={formik.errors.airline_id as string}
                touched={formik.touched.airline_id}
                searchTerm={searchAirlineTerm}
                onSearchTermChange={setSearchAirlineTerm}
              />
              <SharedAutocomplete
                label="From Country"
                value={formik.values.from_country_id}
                options={countriesData?.data ?? []}
                placeholder="Select country"
                searchPlaceholder="Search country"
                onChange={(val) => {
                  formik.setFieldValue('from_country_id', val);
                  formik.setFieldValue('from_city_id', '');
                }}
                error={formik.errors.from_country_id as string}
                touched={formik.touched.from_country_id}
                searchTerm={searchFromCountryTerm}
                onSearchTermChange={setSearchFromCountryTerm}
              />
              <SharedAutocomplete
                label="From City"
                value={formik.values.from_city_id}
                options={fromCitiesData?.data[0]?.cities ?? []}
                placeholder={formik.values.from_country_id ? 'Select city' : 'Select country first'}
                searchPlaceholder="Search city"
                onChange={(val) => formik.setFieldValue('from_city_id', val)}
                error={formik.errors.from_city_id as string}
                touched={formik.touched.from_city_id}
                searchTerm={searchFromCityTerm}
                onSearchTermChange={setSearchFromCityTerm}
                disabled={!formik.values.from_country_id}
                loading={fromCitiesLoading}
                errorText={fromCitiesIsError ? 'Failed to load cities' : undefined}
                emptyText="No cities available"
              />
              <SharedAutocomplete
                label="To Country"
                value={formik.values.to_country_id}
                options={countriesData?.data ?? []}
                placeholder="Select country"
                searchPlaceholder="Search country"
                onChange={(val) => {
                  formik.setFieldValue('to_country_id', val);
                  formik.setFieldValue('to_city_id', '');
                }}
                error={formik.errors.to_country_id as string}
                touched={formik.touched.to_country_id}
                searchTerm={searchToCountryTerm}
                onSearchTermChange={setSearchToCountryTerm}
              />
              <SharedAutocomplete
                label="To City"
                value={formik.values.to_city_id}
                options={toCitiesData?.data[0]?.cities ?? []}
                placeholder={formik.values.to_country_id ? 'Select city' : 'Select country first'}
                searchPlaceholder="Search city"
                onChange={(val) => formik.setFieldValue('to_city_id', val)}
                error={formik.errors.to_city_id as string}
                touched={formik.touched.to_city_id}
                searchTerm={searchToCityTerm}
                onSearchTermChange={setSearchToCityTerm}
                disabled={!formik.values.to_country_id}
                loading={toCitiesLoading}
                errorText={toCitiesIsError ? 'Failed to load cities' : undefined}
                emptyText="No cities available"
              />
              <SharedAutocomplete
                label="Currency"
                value={formik.values.currency}
                options={currenciesData?.result ?? []}
                placeholder="Select currency"
                searchPlaceholder="Search currency"
                onChange={(val) => {
                  formik.setFieldValue('currency', val);
                }}
                error={formik.errors.currency as string}
                touched={formik.touched.currency}
                searchTerm={searchCurrencyTerm}
                onSearchTermChange={setSearchCurrencyTerm}
              />
              <SharedDecimalInput name="price_per_kg" label="Price per kg" formik={formik} />
              <SharedDecimalInput name="min_weight" label="Min weight" formik={formik} />
              <SharedDecimalInput name="max_weight" label="Max weight" formik={formik} />

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
