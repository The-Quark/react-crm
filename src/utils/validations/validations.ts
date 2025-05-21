import * as Yup from 'yup';

export const PHONE_REG_EXP = /^\+7\d{10}$/;

export const decimalValidation = Yup.string()
  .matches(/^\d+\.\d{2}$/, 'Should be decimal with two digits after dot (e.g. 12.34)')
  .test('non-negative', 'Should not be negative', (value) => {
    if (!value) return false;
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue >= 0;
  });
