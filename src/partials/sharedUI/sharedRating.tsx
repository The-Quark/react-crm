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
    const roundedValue = Math.round(value * 2) / 2;
    const clampedValue = Math.min(10, Math.max(0, roundedValue));

    if (onChange) {
      onChange(clampedValue);
    }
    formik.setFieldValue(name as string, clampedValue);
  };

  return (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex flex-col w-full">
        <div className="flex w-full items-center gap-4">
          <Rating
            value={fieldValue}
            onValueChange={handleValueChange}
            readOnly={disabled}
            allowFraction={true}
            max={10}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <RatingButton key={i + 1} aria-label={`${i + 1}`} />
            ))}
          </Rating>
          <span className="text-sm text-muted-foreground">{fieldValue.toFixed(1)}/10</span>
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
