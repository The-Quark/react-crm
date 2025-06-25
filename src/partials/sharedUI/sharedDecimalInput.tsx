import { FormikProps } from 'formik';
import React, { useState, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import { useIntl } from 'react-intl';

interface SharedInputProps<T> {
  name: keyof T;
  label: string;
  formik: FormikProps<T>;
  disabled?: boolean;
}

export const SharedDecimalInput = <T,>({ name, label, formik, disabled }: SharedInputProps<T>) => {
  const { formatMessage } = useIntl();
  const fieldName = name.toString();
  const [decimalDisplay, setDecimalDisplay] = useState('');
  const hasError = formik.touched[name] && formik.errors[name];

  const formatDecimalDisplay = useCallback((value: string | number): string => {
    if (value === undefined || value === null) return '';

    const stringValue = typeof value === 'number' ? value.toString() : value;

    let cleaned = stringValue.replace(/[^\d.]/g, '');
    const parts = cleaned.split('.');
    if (parts[0]) {
      parts[0] = parts[0].replace(/^0+/, '') || '0';
    } else {
      parts[0] = '0';
    }
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2);
      return `${parts[0]}.${parts[1]}`;
    }
    return parts[0];
  }, []);

  const handleDecimalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!/^[\d.]*$/.test(inputValue)) {
      return;
    }
    const dotCount = (inputValue.match(/\./g) || []).length;
    if (dotCount > 1) {
      return;
    }
    const parts = inputValue.split('.');
    if (parts.length > 1 && parts[1].length > 2) {
      return;
    }
    const formattedValue = formatDecimalDisplay(inputValue);
    setDecimalDisplay(formattedValue);
    formik.setFieldValue(fieldName, formattedValue || '');
  };

  const handleBlur = () => {
    formik.setFieldTouched(fieldName, true);

    if (decimalDisplay) {
      let formattedValue = decimalDisplay;

      // If it's a whole number, add .00
      if (!decimalDisplay.includes('.')) {
        formattedValue = `${decimalDisplay}.00`;
      }
      // If there's only one digit after decimal, add 0
      else if (decimalDisplay.includes('.') && decimalDisplay.split('.')[1].length === 1) {
        formattedValue = `${decimalDisplay}0`;
      }

      setDecimalDisplay(formattedValue);
      formik.setFieldValue(fieldName, formattedValue);
    }
  };

  useEffect(() => {
    const currentValue = (formik.values[name] as string) || '';
    if (currentValue) {
      const formatted = formatDecimalDisplay(currentValue);
      setDecimalDisplay(formatted);
    } else {
      setDecimalDisplay('');
    }
  }, [formik.values[name], name, formatDecimalDisplay]);

  const inputClasses = clsx('input w-full', {
    'border-danger focus:border-danger': hasError
  });

  return (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 ">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex columns-1 w-full flex-wrap">
        <input
          className={inputClasses}
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={decimalDisplay}
          onChange={handleDecimalChange}
          onBlur={handleBlur}
          disabled={disabled}
        />

        {formik.touched[name] && formik.errors[name] && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formatMessage({ id: formik.errors[name] as string })}
          </span>
        )}
      </div>
    </div>
  );
};
