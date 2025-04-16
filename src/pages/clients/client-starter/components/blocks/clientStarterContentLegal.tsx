import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { airlinesMock, curreniesMock, localesMock, timezoneMock } from '@/lib/mocks.ts';

const ClientStarterContentLegal = () => {
  return (
    <div className="card-body grid gap-5">
      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Company Name</label>
        <div className="flex columns-1 w-full flex-wrap">
          <input className="input w-full" type="text" placeholder="Company Name" />
          {/*{formik.touched.company_name && formik.errors.company_name && (*/}
          {/*  <span role="alert" className="text-danger text-xs mt-1">*/}
          {/*    {formik.errors.company_name}*/}
          {/*  </span>*/}
          {/*)}*/}
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Time zone</label>
        <div className="flex columns-1 w-full flex-wrap">
          <Select
          // value={formik.values.timezone}
          // onValueChange={(value) => formik.setFieldValue('timezone', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Time Zone" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {timezoneMock.map((tz) => (
                <SelectItem key={tz.key} value={tz.timezone}>
                  {tz.timezone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/*{formik.touched.timezone && formik.errors.timezone && (*/}
          {/*  <span role="alert" className="text-danger text-xs mt-1">*/}
          {/*    {formik.errors.timezone}*/}
          {/*  </span>*/}
          {/*)}*/}
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Currency</label>
        <div className="flex columns-1 w-full flex-wrap">
          <Select
          // value={formik.values.currency?.toString()}
          // onValueChange={(value) => formik.setFieldValue('currency', String(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Currency" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {curreniesMock.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.label} — {currency.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/*{formik.touched.currency && formik.errors.currency && (*/}
          {/*  <span role="alert" className="text-danger text-xs mt-1">*/}
          {/*    {formik.errors.currency}*/}
          {/*  </span>*/}
          {/*)}*/}
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Language</label>
        <div className="flex columns-1 w-full flex-wrap">
          <Select
          // value={formik.values.language?.toString()}
          // onValueChange={(value) => formik.setFieldValue('language', String(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {localesMock.map((language) => (
                <SelectItem key={language.code} value={language.code}>
                  {language.label} - {language.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/*{formik.touched.language && formik.errors.language && (*/}
          {/*  <span role="alert" className="text-danger text-xs mt-1">*/}
          {/*    {formik.errors.language}*/}
          {/*  </span>*/}
          {/*)}*/}
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Legal Address</label>
        <div className="flex columns-1 w-full flex-wrap">
          <input className="input w-full" type="text" placeholder="Legal Address" />
          {/*{formik.touched.legal_address && formik.errors.legal_address && (*/}
          {/*  <span role="alert" className="text-danger text-xs mt-1">*/}
          {/*    {formik.errors.legal_address}*/}
          {/*  </span>*/}
          {/*)}*/}
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Warehouse Address</label>
        <div className="flex columns-1 w-full flex-wrap">
          <input className="input w-full" type="text" placeholder="Warehouse Address" />
          {/*{formik.touched.warehouse_address && formik.errors.warehouse_address && (*/}
          {/*  <span role="alert" className="text-danger text-xs mt-1">*/}
          {/*    {formik.errors.warehouse_address}*/}
          {/*  </span>*/}
          {/*)}*/}
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Airlines</label>
        <div className="flex columns-1 w-full flex-wrap">
          <Select
          // value={formik.values.airlines?.toString()}
          // onValueChange={(value) => formik.setFieldValue('airlines', String(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Airlines" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {airlinesMock.map((item) => (
                <SelectItem key={item.code} value={item.code}>
                  {item.label} - {item.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/*{formik.touched.airlines && formik.errors.airlines && (*/}
          {/*  <span role="alert" className="text-danger text-xs mt-1">*/}
          {/*    {formik.errors.airlines}*/}
          {/*  </span>*/}
          {/*)}*/}
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Dimension Per Place</label>
        <div className="flex columns-1 w-full flex-wrap">
          <input className="input w-full" type="text" placeholder="Dimension Per Place" />
          {/*{formik.touched.dimensions_per_place && formik.errors.dimensions_per_place && (*/}
          {/*  <span role="alert" className="text-danger text-xs mt-1">*/}
          {/*    {formik.errors.dimensions_per_place}*/}
          {/*  </span>*/}
          {/*)}*/}
        </div>
      </div>

      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">Cost Per Airplace</label>
        <div className="flex columns-1 w-full flex-wrap">
          <input className="input w-full" type="number" placeholder="Cost Per Airplace" />
          {/*{formik.touched.cost_per_airplace && formik.errors.cost_per_airplace && (*/}
          {/*  <span role="alert" className="text-danger text-xs mt-1">*/}
          {/*    {formik.errors.cost_per_airplace}*/}
          {/*  </span>*/}
          {/*)}*/}
        </div>
      </div>

      <div className="flex justify-end">
        {/*<button type="submit" className="btn btn-primary" disabled={loading || formik.isSubmitting}>*/}
        {/*  {loading ? 'Please wait...' : 'Save'}*/}
        {/*</button>*/}
      </div>
    </div>
  );
};

export default ClientStarterContentLegal;
