import { useFormikContext } from 'formik';
import {
  SharedInput,
  SharedIntlPhoneInput,
  SharedSelect,
  SharedTextArea
} from '@/partials/sharedUI';
import { IApplicationPostFormValues } from '@/api/post/postWorkflow/postApplication/types.ts';
import { useIntl } from 'react-intl';
import { mockApplicationsStatusOptions } from '@/utils';
import React, { FC } from 'react';
import { Source } from '@/api/get/getGuides/getSources/types.ts';

interface Props {
  isEditMode: boolean;
  sourcesData?: Source[];
}

export const ApplicationsContactBlock: FC<Props> = ({ isEditMode, sourcesData }) => {
  const { formatMessage } = useIntl();
  const formik = useFormikContext<IApplicationPostFormValues>();

  return (
    <>
      <SharedIntlPhoneInput
        name="phone"
        label={formatMessage({ id: 'SYSTEM.PHONE_NUMBER' })}
        formik={formik}
      />
      <SharedSelect
        name="source"
        label={formatMessage({ id: 'SYSTEM.SOURCE' })}
        formik={formik}
        options={sourcesData?.map((source) => ({ label: source.name, value: source.code })) || []}
      />
      <SharedInput
        name="email"
        label={formatMessage({ id: 'SYSTEM.EMAIL' })}
        formik={formik}
        type="email"
      />
      <SharedTextArea
        name="message"
        label={formatMessage({ id: 'SYSTEM.MESSAGE' })}
        formik={formik}
      />
      {isEditMode && (
        <SharedSelect
          name="status"
          label={formatMessage({ id: 'SYSTEM.STATUS' })}
          formik={formik}
          options={mockApplicationsStatusOptions.map((opt) => ({
            label: opt.name,
            value: opt.value
          }))}
        />
      )}
    </>
  );
};
