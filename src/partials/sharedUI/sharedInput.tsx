import { FormikProps } from 'formik';
import React from 'react';

interface SharedInputProps<T> {
  name: keyof T;
  label: string;
  type?: string;
  formik: FormikProps<T>;
}

export const SharedInput = <T,>({ name, label, type = 'text', formik }: SharedInputProps<T>) => {
  const fieldName = name.toString();

  return (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex columns-1 w-full flex-wrap">
        <input
          className="input w-full"
          type={type}
          placeholder={label}
          {...formik.getFieldProps(fieldName)}
        />
        {formik.touched[name] && formik.errors[name] && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formik.errors[name] as string}
          </span>
        )}
      </div>
    </div>
  );
};
