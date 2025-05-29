import React from 'react';
import { FormikProps } from 'formik';

interface SharedRadioProps<T> {
  name: keyof T;
  label: string;
  formik: FormikProps<T>;
  options: Array<{
    value: string;
    label: string;
  }>;
  disabled?: boolean;
}

export const SharedRadio = <T,>({
  name,
  label,
  formik,
  options,
  disabled = false
}: SharedRadioProps<T>) => {
  const fieldValue = formik.values[name] as unknown as string;
  const error = formik.errors[name] as unknown as string | undefined;
  const touched = formik.touched[name] as unknown as boolean | undefined;

  return (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex columns-1 w-full flex-wrap">
        <div className="flex items-center gap-5">
          {options.map((option) => (
            <label key={option.value} className="radio-group">
              <input
                className="radio-sm"
                name={name as string}
                type="radio"
                value={option.value}
                checked={fieldValue === option.value}
                onChange={() => formik.setFieldValue(name as string, option.value)}
                disabled={disabled}
              />
              <span className="radio-label">{option.label}</span>
            </label>
          ))}
        </div>
        {touched && error && (
          <span role="alert" className="text-danger text-xs mt-1">
            {error}
          </span>
        )}
      </div>
    </div>
  );
};
