'use client';

import { Check, ChevronsUpDown, X } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  error?: string | string[];
  touched?: boolean;
  label: string;
}

export function SharedMultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  error,
  className,
  touched,
  label
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleSelect = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const removeValue = (value: string) => {
    onChange(selectedValues.filter((v) => v !== value));
  };

  return (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex columns-1 w-full flex-wrap">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                'w-full justify-between min-h-10',
                selectedValues.length > 0 ? 'h-auto py-2' : 'h-10',
                className
              )}
            >
              {selectedValues.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {selectedValues.map((value) => {
                    const option = options.find((opt) => opt.value === value);
                    return (
                      <Badge
                        key={value}
                        variant="secondary"
                        className="flex items-center gap-1 pr-1 bg-gray-500 dark:bg-gray-300"
                      >
                        {option?.label}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeValue(value);
                          }}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput
                placeholder={searchPlaceholder}
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup className="max-h-60 overflow-auto">
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedValues.includes(option.value) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {touched && error && (
          <span className="text-xs text-destructive">
            {Array.isArray(error) ? error[0] : error}
          </span>
        )}
      </div>
    </div>
  );
}
