'use client';
import * as React from 'react';
import { MultiSelect } from '@/components';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { SEARCH_DEBOUNCE_DELAY } from '@/utils';

export type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  error?: string | string[];
  touched?: boolean;
  label: string;
  modalPopover?: boolean;
  disabled?: boolean;
  searchTerm?: string;
  onSearchTermChange?: (value: string) => void;
  searchPlaceholder?: string;
  loading?: boolean;
}

export function SharedMultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder,
  searchPlaceholder,
  searchTerm,
  onSearchTermChange,
  error,
  className,
  touched,
  modalPopover = false,
  disabled = false,
  loading,
  label
}: MultiSelectProps) {
  const { formatMessage } = useIntl();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const hasError = touched && error;
  const multiSelectClasses = clsx(className, {
    'border-destructive focus:border-destructive': hasError
  });

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchTermChange?.(localSearchTerm ?? '');
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [localSearchTerm, onSearchTermChange]);

  return (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex columns-1 w-full flex-wrap">
        <MultiSelect
          options={options}
          onValueChange={onChange}
          defaultValue={selectedValues}
          placeholder={placeholder}
          modalPopover={modalPopover}
          disabled={disabled}
          className={multiSelectClasses}
          searchTerm={searchTerm}
          onSearchTermChange={setLocalSearchTerm}
          searchPlaceholder={searchPlaceholder}
          loading={loading}
        />
        {hasError && (
          <span className="text-xs text-destructive mt-1">
            {Array.isArray(error) ? formatMessage({ id: error[0] }) : formatMessage({ id: error })}
          </span>
        )}
      </div>
    </div>
  );
}
