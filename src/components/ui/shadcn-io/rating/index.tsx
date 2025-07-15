'use client';

import { cn } from '@/utils/lib/utils.ts';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { type LucideProps, StarIcon } from 'lucide-react';
import { Children, cloneElement, createContext, useCallback, useContext } from 'react';
import type { KeyboardEvent, MouseEvent, ReactElement, ReactNode } from 'react';

type RatingContextValue = {
  value: number;
  readOnly: boolean;
  handleValueChange: (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
    value: number
  ) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  allowFraction: boolean;
  max: number;
};

const RatingContext = createContext<RatingContextValue | null>(null);

const useRating = () => {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error('useRating must be used within a Rating component');
  }
  return context;
};

export type RatingButtonProps = LucideProps & {
  index?: number;
  icon?: ReactElement<LucideProps>;
};

export const RatingButton = ({
  index: providedIndex,
  size = 20,
  className,
  icon = <StarIcon />
}: RatingButtonProps) => {
  const { value, readOnly, handleValueChange, handleKeyDown, allowFraction } = useRating();

  const index = providedIndex ?? 0;
  const currentValue = value ?? 0;

  // Упрощенная логика для отображения звезд
  const isFullyActive = currentValue >= index + 1;
  const isPartiallyActive = allowFraction && currentValue > index && currentValue < index + 1;

  let fillPercentage = 0;
  if (isFullyActive) {
    fillPercentage = 100;
  } else if (isPartiallyActive) {
    // Точный расчет процента заполнения для половинчатых звезд
    const fraction = currentValue - index;
    fillPercentage = fraction * 100 - 6;
  }

  const tabIndex = readOnly ? -1 : Math.floor(currentValue) === index + 1 ? 0 : -1;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!readOnly && allowFraction) {
      const rect = event.currentTarget.getBoundingClientRect();
      const percent = (event.clientX - rect.left) / rect.width;
      const starValue = percent <= 0.5 ? index + 0.5 : index + 1;
      handleValueChange(event, starValue);
    } else {
      handleValueChange(event, index + 1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={readOnly}
      className={cn(
        'rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'p-0.5 relative inline-block',
        readOnly && 'cursor-default',
        className
      )}
      tabIndex={tabIndex}
    >
      {cloneElement(icon, {
        size,
        className: cn(
          'transition-colors duration-200 text-gray-300',
          !readOnly && 'cursor-pointer'
        ),
        'aria-hidden': 'true'
      })}

      {fillPercentage > 0 && (
        <div
          className="absolute top-0.5 left-0.5 overflow-hidden"
          style={{ width: `${fillPercentage}%` }}
        >
          {cloneElement(icon, {
            size,
            className: cn(
              'transition-colors duration-200 fill-yellow-400 text-yellow-400',
              !readOnly && 'cursor-pointer'
            ),
            'aria-hidden': 'true'
          })}
        </div>
      )}
    </button>
  );
};

export type RatingProps = {
  defaultValue?: number;
  value?: number;
  onChange?: (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
    value: number
  ) => void;
  onValueChange?: (value: number) => void;
  readOnly?: boolean;
  allowFraction?: boolean;
  max?: number;
  className?: string;
  children?: ReactNode;
};

export const Rating = ({
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultValue,
  onChange,
  readOnly = false,
  allowFraction = false,
  max = 5,
  className,
  children,
  ...props
}: RatingProps) => {
  const [value, onValueChange] = useControllableState({
    defaultProp: defaultValue ?? 0,
    prop: controlledValue,
    onChange: controlledOnValueChange
  });

  const handleValueChange = useCallback(
    (event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>, newValue: number) => {
      if (!readOnly) {
        const clampedValue = Math.min(max, Math.max(0, newValue));
        onChange?.(event, clampedValue);
        onValueChange?.(clampedValue);
      }
    },
    [readOnly, onChange, onValueChange, max]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (readOnly) {
        return;
      }

      let newValue = value ?? 0;

      switch (event.key) {
        case 'ArrowRight':
          if (event.shiftKey || event.metaKey) {
            newValue = max;
          } else {
            if (allowFraction) {
              newValue = Math.min(max, newValue + 0.5);
            } else {
              newValue = Math.min(max, newValue + 1);
            }
          }
          break;
        case 'ArrowLeft':
          if (event.shiftKey || event.metaKey) {
            newValue = allowFraction ? 0.5 : 1;
          } else {
            if (allowFraction) {
              newValue = Math.max(0, newValue - 0.5);
            } else {
              newValue = Math.max(1, newValue - 1);
            }
          }
          break;
        default:
          return;
      }

      event.preventDefault();
      handleValueChange(event, newValue);
    },
    [value, readOnly, handleValueChange, max, allowFraction]
  );

  const contextValue: RatingContextValue = {
    value: value ?? 0,
    readOnly,
    handleValueChange,
    handleKeyDown,
    allowFraction,
    max
  };

  return (
    <RatingContext.Provider value={contextValue}>
      <div
        className={cn('inline-flex items-center gap-0.5', className)}
        role="radiogroup"
        aria-label="Rating"
        {...props}
      >
        {Children.map(children, (child, index) => {
          if (!child) {
            return null;
          }

          return cloneElement(child as ReactElement<RatingButtonProps>, {
            index
          });
        })}
      </div>
    </RatingContext.Provider>
  );
};
