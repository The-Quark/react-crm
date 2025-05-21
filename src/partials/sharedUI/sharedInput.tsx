import { FormikProps } from 'formik';
import React, { useState, useEffect, useCallback } from 'react';
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
  const [phoneDisplay, setPhoneDisplay] = useState('');

  // Форматирование телефона для отображения
  const formatPhoneDisplay = useCallback((value: string): string => {
    const digits = value.replace(/\D/g, '');

    if (digits.length === 0) return '';
    if (digits.length === 1) return '+7';
    if (digits.length <= 4) return `+7 (${digits.slice(1)}`;
    if (digits.length <= 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9)
      return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }, []);

  // Инициализация отображаемого значения телефона
  useEffect(() => {
    if (type === 'tel') {
      const currentValue = (formik.values[name] as string) || '';
      console.log('SharedInput tel useEffect:', { name, currentValue, type });
      if (currentValue) {
        const formatted = formatPhoneDisplay(currentValue);
        console.log('Formatted phone:', formatted);
        setPhoneDisplay(formatted);
      } else {
        setPhoneDisplay('');
      }
    }
  }, [formik.values[name], type, name, formatPhoneDisplay]);

  // Обработчик изменений для телефона
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digits = inputValue.replace(/\D/g, '');

    // Ограничиваем до 11 цифр (7 + 10)
    const limitedDigits = digits.slice(0, 11);

    // Форматируем для отображения
    const formatted = formatPhoneDisplay(limitedDigits);
    setPhoneDisplay(formatted);

    // Сохраняем в formik только если введен полный номер
    if (limitedDigits.length === 11) {
      formik.setFieldValue(fieldName, `+${limitedDigits}`);
    } else {
      // Очищаем значение в formik если номер неполный
      formik.setFieldValue(fieldName, '');
    }
  };

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
        ) : type === 'tel' ? (
          <input
            className="input w-full"
            type="tel"
            placeholder="+7 (777) 777-77-77"
            value={phoneDisplay}
            onChange={handlePhoneChange}
            onBlur={() => formik.setFieldTouched(fieldName, true)}
          />
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
