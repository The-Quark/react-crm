import { useFormikContext } from 'formik';
import { SharedInput } from '@/partials/sharedUI';
import { useIntl } from 'react-intl';
import { IApplicationPostFormValues } from '@/api/post/postWorkflow/postApplication/types.ts';

export const ApplicationsRouteBlock = () => {
  const { formatMessage } = useIntl();
  const formik = useFormikContext<IApplicationPostFormValues>();
  return (
    <>
      <h3 className="card-title">{formatMessage({ id: 'SYSTEM.ROUTE' })}</h3>
      <SharedInput
        name="country_of_departure"
        label={formatMessage({ id: 'SYSTEM.DEPARTURE_POINT' })}
        formik={formik}
      />
      <SharedInput
        name="country_of_arrival"
        label={formatMessage({ id: 'SYSTEM.ARRIVAL_POINT' })}
        formik={formik}
      />
    </>
  );
};
