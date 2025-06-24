import { FormikProps } from 'formik';
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
}

export const SharedSelect = <T,>({
  name,
  label,
  formik,
  options,
  placeholder = 'Select...',
  isClearable = false,
  disabled = false,
  onChange
}: Props<T>) => {
  const fieldName = name.toString();
  const currentValue = formik.values[name];
  const hasError = formik.touched[name] && formik.errors[name];

  const CLEAR_OPTION_VALUE = '__CLEAR__';

  const selectTriggerClasses = clsx({
    'border-danger focus:border-danger': hasError
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
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {isClearable && currentValue !== null && currentValue !== undefined && (
              <SelectItem value={CLEAR_OPTION_VALUE}>
                <span className="text-muted-foreground">Clear selection</span>
              </SelectItem>
            )}
            {options.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasError && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formik.errors[name] as string}
          </span>
        )}
      </div>
    </div>
  );
};
