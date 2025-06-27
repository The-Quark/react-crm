import { FormikProps } from 'formik';
import React, { useState, useEffect, useCallback } from 'react';
import { KeenIcon } from '@/components';
import clsx from 'clsx';
import { useIntl } from 'react-intl';

interface SharedInputProps<T> {
  name: keyof T;
  label: string;
  type?: string;
  formik: FormikProps<T>;
  maxlength?: number;
  disabled?: boolean;
}

export const SharedInput = <T,>({
  name,
  label,
  type = 'text',
  formik,
  maxlength,
  disabled
}: SharedInputProps<T>) => {
  const { formatMessage } = useIntl();
  const fieldName = name.toString();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneDisplay, setPhoneDisplay] = useState('');
  const [numberDisplay, setNumberDisplay] = useState('');
  const [decimalDisplay, setDecimalDisplay] = useState('');

  const hasError = formik.touched[name] && formik.errors[name];

  const formatPhoneDisplay = useCallback((value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    const cleanDigits = digits.startsWith('7') ? digits.slice(1) : digits;
    let formatted = '+7';
    if (cleanDigits.length > 0) formatted += ` (${cleanDigits.slice(0, 3)}`;
    if (cleanDigits.length > 3) formatted += `) ${cleanDigits.slice(3, 6)}`;
    if (cleanDigits.length > 6) formatted += `-${cleanDigits.slice(6, 8)}`;
    if (cleanDigits.length > 8) formatted += `-${cleanDigits.slice(8, 10)}`;

    return formatted;
  }, []);

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

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digits = inputValue.replace(/\D/g, '');
    const limitedDigits = maxlength ? digits.slice(0, maxlength) : digits;
    setNumberDisplay(limitedDigits);
    formik.setFieldValue(fieldName, limitedDigits);
  };

  useEffect(() => {
    const currentValue = (formik.values[name] as string) || '';

    if (type === 'tel') {
      if (currentValue) {
        setPhoneDisplay(formatPhoneDisplay(currentValue));
      } else {
        setPhoneDisplay('');
      }
    } else if (type === 'number' && currentValue) {
      setNumberDisplay(currentValue.toString());
    } else if (type === 'decimal') {
      if (currentValue) {
        const formatted = formatDecimalDisplay(currentValue);
        setDecimalDisplay(formatted);
      } else {
        setDecimalDisplay('');
      }
    }
  }, [formik.values[name], type, name, formatPhoneDisplay, formatDecimalDisplay]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digits = inputValue.replace(/\D/g, '');
    const limitedDigits = digits.slice(0, 11);
    const formatted = formatPhoneDisplay(limitedDigits);
    setPhoneDisplay(formatted);
    formik.setFieldValue(fieldName, limitedDigits ? `+${limitedDigits}` : '');
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputClasses = clsx('input w-full', {
    'border-danger': hasError,
    'focus:border-danger': hasError
  });

  const passwordInputClasses = clsx('w-full', {
    'border-danger': hasError,
    'focus:border-danger': hasError
  });

  return (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 ">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex columns-1 w-full flex-wrap">
        {type === 'password' ? (
          <label className={inputClasses}>
            <input
              className={passwordInputClasses}
              autoComplete="off"
              type={showPassword ? 'text' : 'password'}
              placeholder={label}
              {...formik.getFieldProps(fieldName)}
              disabled={disabled}
            />
            <button type="button" className="btn btn-icon" onClick={togglePassword}>
              <KeenIcon icon="eye" className={clsx('text-gray-500', { hidden: showPassword })} />
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: !showPassword })}
              />
            </button>
          </label>
        ) : type === 'tel' ? (
          <input
            className={inputClasses}
            type="tel"
            placeholder="+7 (777) 777-77-77"
            value={phoneDisplay}
            onChange={handlePhoneChange}
            onBlur={() => formik.setFieldTouched(fieldName, true)}
            disabled={disabled}
          />
        ) : type === 'decimal' ? (
          <input
            className={inputClasses}
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={decimalDisplay}
            onChange={handleDecimalChange}
            onBlur={() => formik.setFieldTouched(fieldName, true)}
            disabled={disabled}
          />
        ) : type === 'number' && maxlength ? (
          <input
            className={inputClasses}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={label}
            value={numberDisplay}
            onChange={handleNumberChange}
            onBlur={() => formik.setFieldTouched(fieldName, true)}
            maxLength={maxlength}
            disabled={disabled}
          />
        ) : (
          <input
            className={inputClasses}
            type={type}
            placeholder={label}
            {...formik.getFieldProps(fieldName)}
            disabled={disabled}
          />
        )}

        {formik.touched[name] && formik.errors[name] && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formatMessage({ id: formik.errors[name] as string })}
          </span>
        )}
      </div>
    </div>
  );
};
