import { useFormikContext } from 'formik';
import { SharedDecimalInput } from '@/partials/sharedUI';
import { useIntl } from 'react-intl';
import { IApplicationPostFormValues } from '@/api/post/postWorkflow/postApplication/types.ts';

export const ApplicationsDimensionsBlock = () => {
  const { formatMessage } = useIntl();
  const formik = useFormikContext<IApplicationPostFormValues>();
  return (
    <>
      <h3 className="card-title">{formatMessage({ id: 'SYSTEM.SIZES' })}</h3>
      <SharedDecimalInput
        name="weight"
        label={formatMessage({ id: 'SYSTEM.WEIGHT' }) + ' (kg)'}
        formik={formik}
      />
      <SharedDecimalInput
        name="width"
        label={formatMessage({ id: 'SYSTEM.WIDTH' }) + ' (cm)'}
        formik={formik}
      />
      <SharedDecimalInput
        name="length"
        label={formatMessage({ id: 'SYSTEM.LENGTH' }) + ' (cm)'}
        formik={formik}
      />
      <SharedDecimalInput
        name="height"
        label={formatMessage({ id: 'SYSTEM.HEIGHT' }) + ' (cm)'}
        formik={formik}
      />
    </>
  );
};
