import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

interface Option {
  id: number | string;
  name: string;
}

interface Props {
  value: string | number;
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  onChange: (value: number) => void;
  error?: string;
  touched?: boolean;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  errorText?: string;
  emptyText?: string;
  size?: 'default' | 'sm' | 'lg';
}

const SharedAutocompleteBaseComponent: React.FC<Props> = ({
  value,
  options,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  onChange,
  searchTerm,
  onSearchTermChange,
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  errorText,
  emptyText = 'No options available',
  size = 'default'
}) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleValueChange = useCallback(
    (val: string) => {
      onChange(Number(val));
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
    return options.filter((opt) => opt.name.toLowerCase().includes(term));
  }, [options, debouncedSearchTerm]);

  const renderOptions = useMemo(() => {
    if (loading) {
      return <div className="p-2 text-center text-sm text-muted-foreground">{loadingText}</div>;
    }

    if (errorText) {
      return <div className="p-2 text-center text-sm text-danger">{errorText}</div>;
    }

    if (filteredOptions.length === 0) {
      return <div className="p-2 text-center text-sm text-muted-foreground">{emptyText}</div>;
    }

    return filteredOptions.map((opt) => (
      <SelectItem key={opt.id} value={opt.id.toString()}>
        {opt.name}
      </SelectItem>
    ));
  }, [filteredOptions, loading, loadingText, errorText, emptyText]);

  return (
    <Select value={value?.toString()} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger size={size}>
        <SelectValue placeholder={placeholder} />
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
            placeholder={searchPlaceholder}
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
  );
};

export const SharedAutocompleteBase = memo(SharedAutocompleteBaseComponent);
