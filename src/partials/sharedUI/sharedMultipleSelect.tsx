import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import React, { useMemo, useState } from 'react';

interface Option {
  id: string | number;
  name: string;
}

interface SharedMultipleSelectProps {
  label: string;
  value: (string | number)[];
  options: Option[];
  onChange: (value: (string | number)[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  loading?: boolean;
  error?: string | string[];
  touched?: boolean;
  disabled?: boolean;
}

export const SharedMultipleSelect = ({
  value,
  options,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  loading = false,
  error,
  touched,
  disabled = false,
  label
}: SharedMultipleSelectProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [options, searchTerm]);

  const handleSelect = (id: string | number) => {
    const newValue = value.includes(id) ? value.filter((v) => v !== id) : [...value, id];
    onChange(newValue);
    setSearchTerm('');
  };

  const removeValue = (id: string | number) => {
    onChange(value.filter((v) => v !== id));
  };

  return (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex columns-1 w-full flex-wrap">
        <Select open={open} onOpenChange={setOpen} value={value.join(',')}>
          <SelectTrigger
            className={cn(
              'flex h-auto min-h-10 flex-wrap items-center gap-1',
              error && touched && 'border-destructive'
            )}
            onClick={() => !disabled && setOpen(true)}
          >
            {value.length === 0 && <SelectValue placeholder={placeholder} />}

            <div className="flex flex-wrap gap-1">
              {value.map((id) => {
                const option = options.find((opt) => opt.id === id);
                return (
                  <Badge
                    key={id}
                    variant="outline"
                    className="flex items-center gap-1 pr-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {option?.name}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeValue(id)}
                    />
                  </Badge>
                );
              })}
            </div>
          </SelectTrigger>

          <SelectContent
            className="p-0"
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
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
              />
            </div>

            {loading ? (
              <div className="p-2 text-center text-sm text-muted-foreground">Loading...</div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-2 text-center text-sm text-muted-foreground">No options found</div>
            ) : (
              filteredOptions.map((option) => (
                <SelectItem
                  key={option.id}
                  value={option.id.toString()}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelect(option.id);
                  }}
                  className={cn(
                    'cursor-pointer hover:bg-accent flex items-center justify-between',
                    value.includes(option.id) && 'bg-muted'
                  )}
                >
                  {option.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {touched && error && (
          <span className="text-xs text-destructive">
            {Array.isArray(error) ? error[0] : error}
          </span>
        )}
      </div>
    </div>
  );
};
