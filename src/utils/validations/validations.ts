import * as Yup from 'yup';
import parsePhoneNumber from 'libphonenumber-js';

export const createPhoneValidation = (defaultCountry?: import('libphonenumber-js').CountryCode) => {
  return Yup.string()
    .required('VALIDATION.FORM_VALIDATION_PHONE_REQUIRED')
    .test('is-valid-phone', 'VALIDATION.FORM_VALIDATION_PHONE_INVALID', function (value) {
      if (!value?.trim()) return false;

      try {
        const phoneNumber = parsePhoneNumber(value, defaultCountry);
        return phoneNumber?.isValid() || false;
      } catch {
        return false;
      }
    });
};

export const decimalValidation = Yup.string()
  .matches(/^\d+\.\d{2}$/, 'VALIDATION.DECIMAL_FORMAT')
  .test('non-negative', 'VALIDATION.DECIMAL_NON_NEGATIVE', (value) => {
    if (!value) return false;
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue >= 0;
  });
