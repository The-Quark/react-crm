import { FormikProps } from 'formik';
import React from 'react';
import { Textarea } from '@/components/ui/textarea.tsx';

interface SharedInputProps<T> {
  name: keyof T;
  label: string;
  formik: FormikProps<T>;
}

export const SharedTextArea = <T,>({ name, label, formik }: SharedInputProps<T>) => {
  const fieldName = name.toString();

  return (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 mb-2.5">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex columns-1 w-full flex-wrap">
        <Textarea
          className="textarea w-full"
          placeholder={label}
          {...formik.getFieldProps(fieldName)}
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
