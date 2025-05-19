import { FormikProps } from 'formik';
import React, { useState } from 'react';
import { KeenIcon } from '@/components';
import clsx from 'clsx';

interface SharedInputProps<T> {
  name: keyof T;
  label: string;
  type?: string;
  formik: FormikProps<T>;
}

export const SharedInput = <T,>({ name, label, type = 'text', formik }: SharedInputProps<T>) => {
  const fieldName = name.toString();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 mb-2.5">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex columns-1 w-full flex-wrap">
        {type === 'password' ? (
          <label className="input w-full">
            <input
              className="w-full"
              autoComplete="off"
              type={showPassword ? 'text' : 'password'}
              placeholder={label}
              {...formik.getFieldProps(fieldName)}
            />
            <button type="button" className="btn btn-icon" onClick={togglePassword}>
              <KeenIcon icon="eye" className={clsx('text-gray-500', { hidden: showPassword })} />
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: !showPassword })}
              />
            </button>
          </label>
        ) : (
          <input
            className="input w-full"
            type={type}
            placeholder={label}
            {...formik.getFieldProps(fieldName)}
          />
        )}
        {formik.touched[name] && formik.errors[name] && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formik.errors[name] as string}
          </span>
        )}
      </div>
    </div>
  );
};
