'use client';

import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { FormikProps } from 'formik';
import { useIntl } from 'react-intl';

import { cn } from '@/utils/lib/utils.ts';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface Props<T> {
  name: keyof T;
  label: string;
  formik: FormikProps<T>;
  placeholder?: string;
}

export const SharedDateTimePicker = <T extends Record<string, any>>({
  name,
  label,
  formik,
  placeholder
}: Props<T>) => {
  const { formatMessage } = useIntl();
  const [isOpen, setIsOpen] = React.useState(false);
  const fieldValue = formik.values[name];
  const dateValue = fieldValue ? new Date(fieldValue) : undefined;

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10, ..., 55

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (dateValue) {
        newDate.setHours(dateValue.getHours());
        newDate.setMinutes(dateValue.getMinutes());
      }
      formik.setFieldValue(name as string, newDate.toISOString());
    }
  };

  const handleTimeChange = (type: 'hour' | 'minute' | 'ampm', value: string) => {
    if (dateValue) {
      const newDate = new Date(dateValue);

      if (type === 'hour') {
        const hour = parseInt(value);
        const currentIsPM = newDate.getHours() >= 12;
        newDate.setHours(currentIsPM ? (hour % 12) + 12 : hour % 12);
      } else if (type === 'minute') {
        newDate.setMinutes(parseInt(value));
      } else if (type === 'ampm') {
        const currentHours = newDate.getHours();
        if (value === 'PM' && currentHours < 12) {
          newDate.setHours(currentHours + 12);
        } else if (value === 'AM' && currentHours >= 12) {
          newDate.setHours(currentHours - 12);
        }
      }

      formik.setFieldValue(name as string, newDate.toISOString());
    } else {
      const newDate = new Date();
      if (type === 'hour') {
        const hour = parseInt(value);
        newDate.setHours(hour % 12);
      } else if (type === 'minute') {
        newDate.setMinutes(parseInt(value));
      } else if (type === 'ampm' && value === 'PM') {
        newDate.setHours(newDate.getHours() + 12);
      }
      formik.setFieldValue(name as string, newDate.toISOString());
    }
  };

  const error = formik.touched[name] && formik.errors[name];
  const isError = !!error;

  return (
    <div className="w-full">
      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label flex items-center gap-1 max-w-56">{label}</label>
        <div className="w-full flex flex-col">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !dateValue && 'text-muted-foreground',
                  isError && 'border-destructive'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateValue ? (
                  format(dateValue, 'MM/dd/yyyy hh:mm aa')
                ) : (
                  <span>{placeholder || formatMessage({ id: 'SYSTEM.CHOOSE_DATE_AND_TIME' })}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="sm:flex">
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={handleDateSelect}
                  initialFocus
                />
                <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex sm:flex-col p-2">
                      {hours.map((hour) => (
                        <Button
                          key={hour}
                          size="icon"
                          variant={
                            dateValue && dateValue.getHours() % 12 === hour % 12
                              ? 'default'
                              : 'ghost'
                          }
                          className="sm:w-full shrink-0 aspect-square"
                          onClick={() => handleTimeChange('hour', hour.toString())}
                        >
                          {hour.toString().padStart(2, '0')}
                        </Button>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex sm:flex-col p-2">
                      {minutes.map((minute) => (
                        <Button
                          key={minute}
                          size="icon"
                          variant={
                            dateValue && dateValue.getMinutes() === minute ? 'default' : 'ghost'
                          }
                          className="sm:w-full shrink-0 aspect-square"
                          onClick={() => handleTimeChange('minute', minute.toString())}
                        >
                          {minute.toString().padStart(2, '0')}
                        </Button>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                  <ScrollArea className="">
                    <div className="flex sm:flex-col p-2">
                      {['AM', 'PM'].map((ampm) => (
                        <Button
                          key={ampm}
                          size="icon"
                          variant={
                            dateValue &&
                            ((ampm === 'AM' && dateValue.getHours() < 12) ||
                              (ampm === 'PM' && dateValue.getHours() >= 12))
                              ? 'default'
                              : 'ghost'
                          }
                          className="sm:w-full shrink-0 aspect-square"
                          onClick={() => handleTimeChange('ampm', ampm)}
                        >
                          {ampm}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {isError && (
            <span className="text-destructive text-xs mt-1">
              {typeof error === 'string' ? formatMessage({ id: error }) : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
