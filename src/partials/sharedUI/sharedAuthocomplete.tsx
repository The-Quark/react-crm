import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { SEARCH_DEBOUNCE_DELAY } from '@/utils';

interface Option {
  id: number | string;
  name: string;
}

interface SharedAutocompleteProps {
  label: string;
  value: string | number;
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  onChange: (value: number | string) => void;
  error?: string;
  touched?: boolean;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  errorText?: string;
  emptyText?: string;
  clearable?: boolean;
  clearText?: string;
}

const SharedAutocompleteComponent: React.FC<SharedAutocompleteProps> = ({
  label,
  value,
  options,
  placeholder,
  searchPlaceholder,
  onChange,
  error,
  touched,
  searchTerm,
  onSearchTermChange,
  disabled = false,
  loading = false,
  loadingText,
  errorText,
  emptyText,
  clearable = true,
  clearText
}) => {
  const { formatMessage } = useIntl();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const selectTriggerClasses = clsx('w-full', {
    'border-danger focus:border-danger': touched && error
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleValueChange = useCallback(
    (val: string) => {
      if (val === '__clear__') {
        onChange('');
      } else {
        onChange(Number(val));
      }
    },
    [onChange]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchTermChange(e.target.value);
    },
    [onSearchTermChange]
  );

  const filteredOptions = useMemo(() => {
    if (!debouncedSearchTerm) return options;
    const term = debouncedSearchTerm.toLowerCase();
    return options.filter((opt) => opt.name?.toLowerCase().includes(term));
  }, [options, debouncedSearchTerm]);

  const renderOptions = useMemo(() => {
    if (loading) {
      return (
        <div className="p-2 text-center text-sm text-muted-foreground">
          {loadingText || formatMessage({ id: 'SYSTEM.LOADING' })}
        </div>
      );
    }

    if (errorText) {
      return <div className="p-2 text-center text-sm text-danger">{errorText}</div>;
    }

    const optionsToRender = [];

    if (
      clearable &&
      value &&
      (!debouncedSearchTerm || clearText?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    ) {
      optionsToRender.push(
        <SelectItem key="clear" value="__clear__" className="text-muted-foreground italic">
          {clearText || formatMessage({ id: 'SYSTEM.CLEAR_SELECTION' })}
        </SelectItem>
      );
    }

    filteredOptions.forEach((opt) => {
      optionsToRender.push(
        <SelectItem key={opt.id} value={opt.id.toString()}>
          {opt.name}
        </SelectItem>
      );
    });

    if (optionsToRender.length === 0) {
      optionsToRender.push(
        <div key="empty" className="p-2 text-center text-sm text-muted-foreground">
          {emptyText || formatMessage({ id: 'SYSTEM.NO_OPTIONS' })}
        </div>
      );
    }

    return optionsToRender;
  }, [
    filteredOptions,
    loading,
    loadingText,
    errorText,
    emptyText,
    clearable,
    value,
    clearText,
    debouncedSearchTerm
  ]);

  return (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex columns-1 w-full flex-wrap">
        <Select value={value?.toString()} onValueChange={handleValueChange} disabled={disabled}>
          <SelectTrigger className={selectTriggerClasses}>
            <SelectValue placeholder={placeholder || formatMessage({ id: 'SYSTEM.SELECT' })} />
          </SelectTrigger>
          <SelectContent
            avoidCollisions={false}
            side="bottom"
            align="start"
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="sticky top-0 z-10 bg-background p-2">
              <input
                type="text"
                placeholder={searchPlaceholder || formatMessage({ id: 'SYSTEM.SEARCH' })}
                className="input w-full"
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={disabled}
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
              />
            </div>
            {renderOptions}
          </SelectContent>
        </Select>
        {touched && error && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formatMessage({ id: error as string })}
          </span>
        )}
      </div>
    </div>
  );
};

export const SharedAutocomplete = memo(SharedAutocompleteComponent);
