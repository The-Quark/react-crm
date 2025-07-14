import { FormikProps } from 'formik';
import { useIntl } from 'react-intl';
import React from 'react';
import PhoneInput from 'react-phone-input-2';
import clsx from 'clsx';
import 'react-phone-input-2/lib/style.css';

interface Props<T> {
  name: keyof T;
  label: string;
  formik: FormikProps<T>;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string | number) => void;
}

export const SharedIntlPhoneInput = <T,>({
  name,
  label,
  formik,
  placeholder,
  disabled = false,
  onChange
}: Props<T>) => {
  const { formatMessage } = useIntl();
  const fieldName = name.toString();
  const currentValue = formik.values[name];
  const hasError = formik.touched[name] && formik.errors[name];

  const selectTriggerClasses = clsx({
    'border-danger focus:border-danger': hasError
  });

  return (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex columns-1 w-full flex-wrap">
        <PhoneInput country={'us'} />
        {hasError && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formatMessage({ id: formik.errors[name] as string })}
          </span>
        )}
      </div>
    </div>
  );
};
