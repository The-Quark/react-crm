import React from 'react';
import { FormikProps } from 'formik';
import { useIntl } from 'react-intl';
import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';

interface SharedRatingProps<T> {
  name: keyof T;
  label: string;
  formik: FormikProps<T>;
  disabled?: boolean;
  onChange?: (value: number) => void;
}

export const SharedRating = <T,>({
  name,
  label,
  formik,
  disabled = false,
  onChange
}: SharedRatingProps<T>) => {
  const { formatMessage } = useIntl();

  const fieldValue = formik.values[name] as unknown as number;
  const error = formik.errors[name] as unknown as string | undefined;
  const touched = formik.touched[name] as unknown as boolean | undefined;

  const handleValueChange = (value: number) => {
    if (onChange) {
      onChange(value);
    }
    formik.setFieldValue(name as string, value);
  };

  return (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex flex-col w-full">
        <div className="flex w-full items-center gap-4">
          <Rating value={fieldValue} onValueChange={handleValueChange} readOnly={disabled}>
            {[1, 2, 3, 4, 5].map((value) => (
              <RatingButton key={value} index={value} aria-label={`${value} stars`} />
            ))}
          </Rating>
        </div>
        {touched && error && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formatMessage({ id: error })}
          </span>
        )}
      </div>
    </div>
  );
};
