import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import { KeenIcon } from '@/components';
import { CalendarDate } from '@/components/ui/calendarDate.tsx';

const createClientSchema = Yup.object().shape({
  name: Yup.string().required('Client name is required'),
  surname: Yup.string().required('Client surname is required'),
  patronymic: Yup.string().required('Client patronymic is required'),
  birth_date: Yup.string().required('Client birth date is required'),
  gender: Yup.string().required('Client gender date is required')
});

interface IClientFormValues {
  name: string;
  surname: string;
  patronymic: string;
  birth_date: string;
  gender: 'male' | 'female';
}

const ClientStarterContentIndividual = () => {
  const [loading, setLoading] = useState(false);

  const initialValues: IClientFormValues = {
    name: '',
    surname: '',
    patronymic: '',
    birth_date: '',
    gender: 'male'
  };

  const formik = useFormik({
    initialValues,
    validationSchema: createClientSchema,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      setLoading(true);
      setStatus(null);
      console.log('Values: ', values);
      // try {
      //   await postCreateGlobalParameter(values);
      //   resetForm();
      //   setStatus('Global Parameters created successfully!');
      // } catch (err) {
      //   const error = err as AxiosError<{ message?: string }>;
      //   setStatus(error.response?.data?.message || 'Failed to create global parameters');
      // }
      setLoading(false);
      setSubmitting(false);
    }
  });
  return (
    <form className="card-body grid gap-5" onSubmit={formik.handleSubmit} noValidate>
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
        <label className="form-label max-w-56">Surname</label>
        <div className="flex columns-1 w-full flex-wrap">
          <input
            className="input w-full"
            type="text"
            placeholder="Surname"
            {...formik.getFieldProps('surname')}
          />
          {formik.touched.surname && formik.errors.surname && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.surname}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Patronymic</label>
        <div className="flex columns-1 w-full flex-wrap">
          <input
            className="input w-full"
            type="text"
            placeholder="Patronymic"
            {...formik.getFieldProps('patronymic')}
          />
          {formik.touched.patronymic && formik.errors.patronymic && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.patronymic}
            </span>
          )}
        </div>
      </div>

      <div className="w-full">
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label flex- items-center gap-1 max-w-56">Birth Date</label>
          <div className="w-full flex columns-1 flex-wrap">
            <Popover>
              <PopoverTrigger asChild>
                <button id="date" className={cn('input data-[state=open]:border-primary')}>
                  <KeenIcon icon="calendar" className="-ms-0.5" />
                  <span>Pick a date</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarDate
                  initialFocus
                  mode="single"
                  captionLayout="dropdown"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                  defaultMonth={new Date(2000, 0)}
                  selected={formik.getFieldProps('birth_date').value}
                  onSelect={(value) => formik.setFieldValue('birth_date', value)}
                />
              </PopoverContent>
            </Popover>
            {formik.touched.birth_date && formik.errors.birth_date && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.birth_date}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Gender</label>
        <div className="flex columns-1 w-full flex-wrap">
          <Select
            value={formik.values.gender}
            onValueChange={(value) => formik.setFieldValue('gender', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {['male', 'female'].map((gender) => (
                <SelectItem key={gender} value={gender}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.touched.gender && formik.errors.gender && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.gender}
            </span>
          )}
        </div>
      </div>

      {/*<div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">*/}
      {/*  <label className="form-label max-w-56">Currency</label>*/}
      {/*  <div className="flex columns-1 w-full flex-wrap">*/}
      {/*    <Select*/}
      {/*    // value={formik.values.currency?.toString()}*/}
      {/*    // onValueChange={(value) => formik.setFieldValue('currency', String(value))}*/}
      {/*    >*/}
      {/*      <SelectTrigger>*/}
      {/*        <SelectValue placeholder="Select Currency" />*/}
      {/*      </SelectTrigger>*/}
      {/*      <SelectContent className="max-h-60 overflow-y-auto">*/}
      {/*        {curreniesMock.map((currency) => (*/}
      {/*          <SelectItem key={currency.code} value={currency.code}>*/}
      {/*            {currency.label} — {currency.code}*/}
      {/*          </SelectItem>*/}
      {/*        ))}*/}
      {/*      </SelectContent>*/}
      {/*    </Select>*/}
      {/*    /!*{formik.touched.currency && formik.errors.currency && (*!/*/}
      {/*    /!*  <span role="alert" className="text-danger text-xs mt-1">*!/*/}
      {/*    /!*    {formik.errors.currency}*!/*/}
      {/*    /!*  </span>*!/*/}
      {/*    /!*)}*!/*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*<div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">*/}
      {/*  <label className="form-label max-w-56">Language</label>*/}
      {/*  <div className="flex columns-1 w-full flex-wrap">*/}
      {/*    <Select*/}
      {/*    // value={formik.values.language?.toString()}*/}
      {/*    // onValueChange={(value) => formik.setFieldValue('language', String(value))}*/}
      {/*    >*/}
      {/*      <SelectTrigger>*/}
      {/*        <SelectValue placeholder="Select Language" />*/}
      {/*      </SelectTrigger>*/}
      {/*      <SelectContent className="max-h-60 overflow-y-auto">*/}
      {/*        {localesMock.map((language) => (*/}
      {/*          <SelectItem key={language.code} value={language.code}>*/}
      {/*            {language.label} - {language.code}*/}
      {/*          </SelectItem>*/}
      {/*        ))}*/}
      {/*      </SelectContent>*/}
      {/*    </Select>*/}
      {/*    /!*{formik.touched.language && formik.errors.language && (*!/*/}
      {/*    /!*  <span role="alert" className="text-danger text-xs mt-1">*!/*/}
      {/*    /!*    {formik.errors.language}*!/*/}
      {/*    /!*  </span>*!/*/}
      {/*    /!*)}*!/*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*<div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">*/}
      {/*  <label className="form-label max-w-56">Legal Address</label>*/}
      {/*  <div className="flex columns-1 w-full flex-wrap">*/}
      {/*    <input className="input w-full" type="text" placeholder="Legal Address" />*/}
      {/*    /!*{formik.touched.legal_address && formik.errors.legal_address && (*!/*/}
      {/*    /!*  <span role="alert" className="text-danger text-xs mt-1">*!/*/}
      {/*    /!*    {formik.errors.legal_address}*!/*/}
      {/*    /!*  </span>*!/*/}
      {/*    /!*)}*!/*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*<div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">*/}
      {/*  <label className="form-label max-w-56">Warehouse Address</label>*/}
      {/*  <div className="flex columns-1 w-full flex-wrap">*/}
      {/*    <input className="input w-full" type="text" placeholder="Warehouse Address" />*/}
      {/*    /!*{formik.touched.warehouse_address && formik.errors.warehouse_address && (*!/*/}
      {/*    /!*  <span role="alert" className="text-danger text-xs mt-1">*!/*/}
      {/*    /!*    {formik.errors.warehouse_address}*!/*/}
      {/*    /!*  </span>*!/*/}
      {/*    /!*)}*!/*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*<div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">*/}
      {/*  <label className="form-label max-w-56">Airlines</label>*/}
      {/*  <div className="flex columns-1 w-full flex-wrap">*/}
      {/*    <Select*/}
      {/*    // value={formik.values.airlines?.toString()}*/}
      {/*    // onValueChange={(value) => formik.setFieldValue('airlines', String(value))}*/}
      {/*    >*/}
      {/*      <SelectTrigger>*/}
      {/*        <SelectValue placeholder="Select Airlines" />*/}
      {/*      </SelectTrigger>*/}
      {/*      <SelectContent className="max-h-60 overflow-y-auto">*/}
      {/*        {airlinesMock.map((item) => (*/}
      {/*          <SelectItem key={item.code} value={item.code}>*/}
      {/*            {item.label} - {item.code}*/}
      {/*          </SelectItem>*/}
      {/*        ))}*/}
      {/*      </SelectContent>*/}
      {/*    </Select>*/}
      {/*    /!*{formik.touched.airlines && formik.errors.airlines && (*!/*/}
      {/*    /!*  <span role="alert" className="text-danger text-xs mt-1">*!/*/}
      {/*    /!*    {formik.errors.airlines}*!/*/}
      {/*    /!*  </span>*!/*/}
      {/*    /!*)}*!/*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*<div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">*/}
      {/*  <label className="form-label max-w-56">Dimension Per Place</label>*/}
      {/*  <div className="flex columns-1 w-full flex-wrap">*/}
      {/*    <input className="input w-full" type="text" placeholder="Dimension Per Place" />*/}
      {/*    /!*{formik.touched.dimensions_per_place && formik.errors.dimensions_per_place && (*!/*/}
      {/*    /!*  <span role="alert" className="text-danger text-xs mt-1">*!/*/}
      {/*    /!*    {formik.errors.dimensions_per_place}*!/*/}
      {/*    /!*  </span>*!/*/}
      {/*    /!*)}*!/*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*<div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">*/}
      {/*  <label className="form-label max-w-56">Cost Per Airplace</label>*/}
      {/*  <div className="flex columns-1 w-full flex-wrap">*/}
      {/*    <input className="input w-full" type="number" placeholder="Cost Per Airplace" />*/}
      {/*    /!*{formik.touched.cost_per_airplace && formik.errors.cost_per_airplace && (*!/*/}
      {/*    /!*  <span role="alert" className="text-danger text-xs mt-1">*!/*/}
      {/*    /!*    {formik.errors.cost_per_airplace}*!/*/}
      {/*    /!*  </span>*!/*/}
      {/*    /!*)}*!/*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={loading || formik.isSubmitting}>
          {loading ? 'Please wait...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default ClientStarterContentIndividual;
