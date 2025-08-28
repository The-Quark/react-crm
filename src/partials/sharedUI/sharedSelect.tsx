import { FormikProps } from 'formik';
import { useIntl } from 'react-intl';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import clsx from 'clsx';

interface Props<T> {
  name: keyof T;
  label: string;
  formik: FormikProps<T>;
  options: { label: string; value: string | number }[];
  placeholder?: string;
  isClearable?: boolean;
  disabled?: boolean;
  onChange?: (value: string | number) => void;
  emptyMessage?: string;
}

export const SharedSelect = <T,>({
  name,
  label,
  formik,
  options,
  placeholder,
  isClearable = false,
  disabled = false,
  onChange,
  emptyMessage
}: Props<T>) => {
  const { formatMessage } = useIntl();
  const fieldName = name.toString();
  const currentValue = formik.values[name];
  const hasError = formik.touched[name] && formik.errors[name];

  const CLEAR_OPTION_VALUE = '__CLEAR__';
  const isEmpty = options.length === 0;

  const selectTriggerClasses = clsx({
    'border-danger focus:border-danger': hasError,
    'opacity-50 cursor-not-allowed': isEmpty
  });

  return (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex columns-1 w-full flex-wrap">
        <Select
          disabled={disabled}
          value={currentValue === null || currentValue === undefined ? '' : String(currentValue)}
          onValueChange={(value) => {
            if (isClearable && value === CLEAR_OPTION_VALUE) {
              formik.setFieldValue(fieldName, null);
              onChange?.('');
            } else {
              const finalValue = isNaN(Number(value)) ? value : Number(value);
              formik.setFieldValue(fieldName, finalValue);
              onChange?.(finalValue);
            }
          }}
        >
          <SelectTrigger className={selectTriggerClasses}>
            <SelectValue placeholder={placeholder || formatMessage({ id: 'SYSTEM.SELECT' })} />
          </SelectTrigger>
          <SelectContent>
            {isEmpty ? (
              <div className="py-2 px-2 text-center text-muted-foreground text-sm">
                {emptyMessage || formatMessage({ id: 'SYSTEM.EMPTY_STATE' })}
              </div>
            ) : (
              <>
                {isClearable && currentValue !== null && currentValue !== undefined && (
                  <SelectItem value={CLEAR_OPTION_VALUE}>
                    <span className="text-muted-foreground">
                      {formatMessage({ id: 'SYSTEM.CLEAR_SELECTION' })}
                    </span>
                  </SelectItem>
                )}
                {options.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
        {hasError && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formatMessage({ id: formik.errors[name] as string })}
          </span>
        )}
      </div>
    </div>
  );
};
