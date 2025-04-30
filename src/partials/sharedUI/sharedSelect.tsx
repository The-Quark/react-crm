import { FormikProps } from 'formik';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';

interface Props<T> {
  name: keyof T;
  label: string;
  formik: FormikProps<T>;
  options: { label: string; value: string | number }[];
  placeholder?: string;
}

export const SharedSelect = <T,>({
  name,
  label,
  formik,
  options,
  placeholder = 'Select...'
}: Props<T>) => {
  const fieldName = name.toString();

  return (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex columns-1 w-full flex-wrap">
        <Select
          value={formik.values[name]?.toString() || ''}
          onValueChange={(value) => formik.setFieldValue(fieldName, String(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formik.touched[name] && formik.errors[name] && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formik.errors[name] as string}
          </span>
        )}
      </div>
    </div>
  );
};
