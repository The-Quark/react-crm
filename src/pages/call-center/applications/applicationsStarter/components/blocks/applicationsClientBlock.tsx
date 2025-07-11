import { useFormikContext } from 'formik';
import { SharedAutocomplete, SharedInput, SharedRadio } from '@/partials/sharedUI';
import { useIntl } from 'react-intl';
import { IApplicationPostFormValues } from '@/api/post/postWorkflow/postApplication/types.ts';
import React, { FC, useCallback } from 'react';
import { ClientType } from '@/api/enums';
import { Client } from '@/api/get/getClients/types.ts';

interface Props {
  isEditMode: boolean;
  clientsData?: Client[];
  clientLoading: boolean;
  onSearchChange: (value: string) => void;
  searchTerm: string;
}

export const ApplicationsClientBlock: FC<Props> = ({
  isEditMode,
  clientsData,
  clientLoading,
  onSearchChange,
  searchTerm
}) => {
  const { formatMessage } = useIntl();
  const formik = useFormikContext<IApplicationPostFormValues>();

  const resetClientFields = useCallback(() => {
    return {
      first_name: '',
      last_name: '',
      patronymic: '',
      company_name: '',
      bin: '',
      client_type: 'individual',
      phone: '',
      email: '',
      source: '',
      client_id: ''
    };
  }, []);

  const handleClientTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newType = e.target.value as 'individual' | 'legal';
      const currentClientId = formik.values.client_id;
      formik.resetForm();
      formik.setFieldValue('client_type', newType);
      if (currentClientId) {
        formik.setFieldValue('client_id', currentClientId);
      }
    },
    [formik]
  );

  const handleClientChange = useCallback(
    (val: string | number | null) => {
      if (formik.values.client_id === val) return;
      formik.setFieldValue('client_id', val ?? '');
      if (val === null || val === '') {
        const resetFields = resetClientFields();
        Object.entries(resetFields).forEach(([field, value]) => {
          formik.setFieldValue(field, value);
        });
      }
    },
    [formik, resetClientFields]
  );

  return (
    <>
      {!isEditMode && (
        <>
          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.CLIENT' })}
            value={formik.values.client_id ?? ''}
            options={
              clientsData?.map((client) => ({
                id: client.id,
                name: client.search_application ?? ''
              })) ?? []
            }
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_CLIENT' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_CLIENT' })}
            onChange={handleClientChange}
            error={formik.errors.client_id as string}
            touched={formik.touched.client_id}
            searchTerm={searchTerm}
            onSearchTermChange={onSearchChange}
            loading={clientLoading}
          />
          <SharedRadio
            name="client_type"
            label={formatMessage({ id: 'SYSTEM.CLIENT_TYPE' })}
            formik={formik}
            options={[
              {
                value: 'individual',
                label: formatMessage({ id: 'SYSTEM.CLIENT_TYPE_INDIVIDUAL' })
              },
              { value: 'legal', label: formatMessage({ id: 'SYSTEM.CLIENT_TYPE_LEGAL' }) }
            ]}
            disabled={!!formik.values.client_id}
            onChange={handleClientTypeChange}
          />
        </>
      )}

      {formik.values.client_type === ClientType.LEGAL && (
        <>
          <SharedInput
            name="company_name"
            label={formatMessage({ id: 'SYSTEM.COMPANY_NAME' })}
            formik={formik}
          />
          <SharedInput
            name="bin"
            label={formatMessage({ id: 'SYSTEM.BIN' })}
            formik={formik}
            type="number"
            maxlength={12}
          />
        </>
      )}

      {formik.values.client_type === ClientType.INDIVIDUAL && (
        <>
          <SharedInput
            name="first_name"
            label={formatMessage({ id: 'SYSTEM.FIRST_NAME' })}
            formik={formik}
          />
          <SharedInput
            name="last_name"
            label={formatMessage({ id: 'SYSTEM.LAST_NAME' })}
            formik={formik}
          />
          <SharedInput
            name="patronymic"
            label={formatMessage({ id: 'SYSTEM.PATRONYMIC' })}
            formik={formik}
          />
        </>
      )}
    </>
  );
};
