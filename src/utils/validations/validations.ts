import * as Yup from 'yup';

export const decimalValidation = Yup.string()
  .matches(/^\d+\.\d{2}$/, 'VALIDATION.DECIMAL_FORMAT')
  .test('non-negative', 'VALIDATION.DECIMAL_NON_NEGATIVE', (value) => {
    if (!value) return false;
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue >= 0;
  });
