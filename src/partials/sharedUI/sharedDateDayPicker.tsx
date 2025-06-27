import React from 'react';
import { FormikProps } from 'formik';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/utils/lib/utils.ts';
import { KeenIcon } from '@/components';
import { CalendarDate } from '@/components/ui/calendarDate.tsx';
import { useIntl } from 'react-intl';

interface SharedDateDayPickerProps<T> {
  name: keyof T;
  label: string;
  formik: FormikProps<T>;
}

export const SharedDateDayPicker = <T,>({ name, label, formik }: SharedDateDayPickerProps<T>) => {
  const { formatMessage } = useIntl();
  const hasError = formik.touched[name] && formik.errors[name];

  return (
    <div className="w-full">
      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label flex- items-center gap-1 max-w-56">{label}</label>
        <div className="w-full flex columns-1 flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <button id="date" className={cn('input data-[state=open]:border-primary')}>
                <KeenIcon icon="calendar" className="-ms-0.5" />
                <span>
                  {formik.values[name]
                    ? new Date(formik.values[name] as string | number | Date).toLocaleDateString()
                    : formatMessage({ id: 'SYSTEM.PICK_DATE' })}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarDate
                initialFocus
                mode="single"
                captionLayout="dropdown"
                fromYear={1900}
                toYear={new Date().getFullYear()}
                defaultMonth={new Date(2000, 0)}
                selected={formik.getFieldProps(name as string).value as Date | undefined}
                onSelect={(value: Date | undefined) => formik.setFieldValue(name as string, value)}
              />
            </PopoverContent>
          </Popover>
          {hasError && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formatMessage({ id: String(formik.errors[name]) })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
