import { FormikProps } from 'formik';
import { useIntl } from 'react-intl';
import React from 'react';
import 'react-phone-input-2/lib/style.css';
import { useLanguage } from '@/providers';
import { TLanguageCode } from '@/i18n';
import { PhoneInput } from '@/components/ui/phone-input.tsx';
import * as RPNInput from 'react-phone-number-input';

interface Props<T> {
  name: keyof T;
  label: string;
  formik: FormikProps<T>;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string | number) => void;
}

const LANGUAGE_TO_COUNTRY_MAP: Record<TLanguageCode, string> = {
  en: 'US',
  ru: 'RU',
  ar: 'SA'
};

export const SharedIntlPhoneInput = <T,>({
  name,
  label,
  formik,
  placeholder,
  disabled = false,
  onChange
}: Props<T>) => {
  const { currentLanguage } = useLanguage();
  const { formatMessage } = useIntl();
  const fieldName = name.toString();
  const currentValue = formik.values[name] as string;
  const hasError = formik.touched[name] && formik.errors[name];

  const defaultCountry = LANGUAGE_TO_COUNTRY_MAP[currentLanguage.code] || 'us';

  const handleChange = (value: string) => {
    formik.setFieldValue(fieldName, value);
    onChange?.(value);
  };
  return (
    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
      <label className="form-label max-w-56">{label}</label>
      <div className="flex columns-1 w-full flex-wrap">
        <PhoneInput
          value={currentValue}
          onChange={handleChange}
          defaultCountry={defaultCountry as RPNInput.Country}
          disabled={disabled}
          placeholder={placeholder || label}
          className="w-full"
          international={true}
          searchCountryPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_COUNTRY' })}
        />
        {hasError && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formatMessage({ id: formik.errors[name] as string })}
          </span>
        )}
      </div>
    </div>
  );
};
