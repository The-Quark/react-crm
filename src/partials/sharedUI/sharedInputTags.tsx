'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { cn } from '@/utils/lib/utils.ts';
import { type InputProps } from '@/components/ui/input.tsx';

type InputTagsProps = Omit<InputProps, 'value' | 'onChange'> & {
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  label: string;
  error?: string | string[];
  touched?: boolean;
};

const SharedInputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  ({ className, value, onChange, label, error, touched, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState('');

    React.useEffect(() => {
      if (pendingDataPoint.includes(',')) {
        const newDataPoints = new Set([
          ...value,
          ...pendingDataPoint.split(',').map((chunk) => chunk.trim())
        ]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint('');
      }
    }, [pendingDataPoint, onChange, value]);

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...value, pendingDataPoint]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint('');
      }
    };

    return (
      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
        <label className="form-label max-w-56">{label}</label>
        <div className="flex columns-1 w-full flex-wrap">
          <div
            className={cn(
              // caveat: :has() variant requires tailwind v3.4 or above: https://tailwindcss.com/blog/tailwindcss-v3-4#new-has-variant
              'has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-neutral-950 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-neutral-300 min-h-10 flex w-full flex-wrap gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white  disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950',
              className
            )}
          >
            {value.map((item) => (
              <Badge key={item} variant="secondary" className="bg-gray-500 dark:bg-gray-300">
                {item}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 h-3 w-3"
                  onClick={() => {
                    onChange(value.filter((i) => i !== item));
                  }}
                >
                  <XIcon className="w-3" />
                </Button>
              </Badge>
            ))}
            <input
              className="flex-1 bg-transparent  outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
              value={pendingDataPoint}
              placeholder={label || '...'}
              onChange={(e) => setPendingDataPoint(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  addPendingDataPoint();
                } else if (
                  e.key === 'Backspace' &&
                  pendingDataPoint.length === 0 &&
                  value.length > 0
                ) {
                  e.preventDefault();
                  onChange(value.slice(0, -1));
                }
              }}
              {...Object.fromEntries(Object.entries(props).filter(([k]) => k !== 'size'))}
              ref={ref}
            />
          </div>
          {touched && error && (
            <span className="text-xs text-destructive">
              {Array.isArray(error) ? error[0] : error}
            </span>
          )}
        </div>
      </div>
    );
  }
);

SharedInputTags.displayName = 'InputTags';

export { SharedInputTags };
