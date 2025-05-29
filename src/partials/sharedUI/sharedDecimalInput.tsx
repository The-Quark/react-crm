import { FormikProps } from 'formik';
import React, { useState, useEffect, useCallback } from 'react';

interface SharedInputProps<T> {
  name: keyof T;
  label: string;
  formik: FormikProps<T>;
  disabled?: boolean;
}

export const SharedDecimalInput = <T,>({ name, label, formik, disabled }: SharedInputProps<T>) => {
  const fieldName = name.toString();
  const [decimalDisplay, setDecimalDisplay] = useState('');

  const formatDecimalDisplay = useCallback((value: string): string => {
    if (!value) return '';
    let cleaned = value.replace(/[^\d.]/g, '');
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

      // Если введено целое число, добавляем .00
      if (!decimalDisplay.includes('.')) {
        formattedValue = `${decimalDisplay}.00`;
      }
      // Если есть только одна цифра после точки, добавляем 0
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

  return (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 ">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex columns-1 w-full flex-wrap">
        <input
          className="input w-full"
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
            {formik.errors[name] as string}
          </span>
        )}
      </div>
    </div>
  );
};
