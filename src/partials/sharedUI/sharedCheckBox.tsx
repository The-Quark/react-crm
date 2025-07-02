import { FormikProps } from 'formik';
import React from 'react';
import { useIntl } from 'react-intl';

interface SharedInputProps<T> {
  name: keyof T;
  label: string;
  formik: FormikProps<T>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SharedCheckBox = <T,>({ name, label, formik, onChange }: SharedInputProps<T>) => {
  const { formatMessage } = useIntl();

  const fieldName = name.toString();
  const hasError = formik.touched[name] && formik.errors[name];
  const value = formik.values[name] as unknown;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    onChange?.(e);
  };

  return (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 mb-2.5">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex columns-1 w-full flex-wrap">
        <label className="checkbox-group flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!value}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            name={fieldName}
            className="checkbox-sm"
          />
          <span className="checkbox-label">{formatMessage({ id: 'SYSTEM.YES' })}</span>
        </label>
        {hasError && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formatMessage({ id: formik.errors[name] as string })}
          </span>
        )}
      </div>
    </div>
  );
};
