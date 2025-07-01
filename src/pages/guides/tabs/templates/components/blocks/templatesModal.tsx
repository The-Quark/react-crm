import React, { FC, useState } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog.tsx';
import { KeenIcon } from '@/components';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { getTemplates, getGlobalParameters, getLanguages, putTemplate, postTemplate } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedSelect,
  SharedTextArea
} from '@/partials/sharedUI';
import { ITemplatesResponse } from '@/api/get/getGuides/getTemplates/types.ts';
import { TemplateType } from '@/api/enums';
import { ITemplatesFormValues } from '@/api/post/postGuides/postTemplate/types.ts';
import { templateTypesOptions } from '@/utils/enumsOptions/mocks.ts';
import { useIntl } from 'react-intl';
import { CACHE_TIME_DEFAULT } from '@/utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: number;
  selectedLanguage: string;
}

const validateSchema = Yup.object({
  company_id: Yup.string().required('VALIDATION.COMPANY_REQUIRED'),
  language_code: Yup.string().required('VALIDATION.LANGUAGE_CODE_REQUIRED'),
  code: Yup.string()
    .matches(/^[A-Za-z0-9_]+$/, 'VALIDATION.CODE_FORMAT_ALPHANUMERIC_UNDERSCORE')
    .required('VALIDATION.CODE_REQUIRED'),
  type: Yup.string().oneOf(Object.values(TemplateType), 'VALIDATION.TEMPLATE_TYPE_INVALID'),
  title: Yup.string().required('VALIDATION.TITLE_REQUIRED'),
  subject: Yup.string().required('VALIDATION.SUBJECT_REQUIRED'),
  content: Yup.string().required('VALIDATION.CONTENT_REQUIRED')
});

const getInitialValues = (
  isEditMode: boolean,
  templaTtesData: ITemplatesResponse
): ITemplatesFormValues => {
  if (isEditMode && templaTtesData?.result) {
    const data = templaTtesData.result[0];
    return {
      company_id: String(data.company_id) || '',
      language_code: String(data.language[0].crm_language.code) || '',
      code: data.code || '',
      type: data.type || '',
      content: data.language[0].content || '',
      subject: data.language[0].subject || '',
      title: data.language[0].title || ''
    };
  }
  return {
    company_id: '',
    language_code: '',
    code: '',
    type: TemplateType.EMAIL,
    content: '',
    subject: '',
    title: ''
  };
};

export const TemplatesModal: FC<Props> = ({ open, onOpenChange, id, selectedLanguage }) => {
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();

  const [loading, setLoading] = useState(false);
  const [searchCompanyTerm, setSearchCompanyTerm] = useState('');

  const {
    data: templateData,
    isLoading: templateLoading,
    isError: templateIsError,
    error: templateError
  } = useQuery({
    queryKey: ['formTemplate', id],
    queryFn: () => getTemplates({ id: Number(id), language_code: selectedLanguage }),
    enabled: !!id && open
  });

  const {
    data: companyData,
    isLoading: companyLoading,
    isError: companyIsError,
    error: companyError
  } = useQuery({
    queryKey: ['templatesCompany'],
    queryFn: () => getGlobalParameters(),
    staleTime: CACHE_TIME_DEFAULT,
    enabled: open
  });

  const {
    data: languageData,
    isLoading: languageLoading,
    isError: languageIsError,
    error: languageError
  } = useQuery({
    queryKey: ['templatesLanguage'],
    queryFn: () => getLanguages({}),
    staleTime: CACHE_TIME_DEFAULT,
    enabled: open
  });

  const formik = useFormik({
    initialValues: getInitialValues(!!id, templateData as ITemplatesResponse),
    enableReinitialize: true,
    validationSchema: validateSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (id) {
          await putTemplate(Number(id), values);
        } else {
          await postTemplate(values);
        }
        resetForm();
        setSearchCompanyTerm('');
        onOpenChange(false);
        queryClient.invalidateQueries({ queryKey: ['guidesTemplates'] });
      } catch (err) {
        console.error('Error submitting:', err);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  const handleClose = () => {
    formik.resetForm();
    queryClient.removeQueries({ queryKey: ['formTemplate'] });
    onOpenChange(false);
  };

  const isFormLoading = id
    ? templateLoading || companyLoading || languageLoading
    : companyLoading || languageLoading;

  const isFormError = id
    ? templateIsError || companyIsError || languageIsError
    : companyIsError || languageIsError;

  const formErrors = [templateError, languageError, companyError].filter((error) => error !== null);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
            {formatMessage({ id: id ? 'SYSTEM.UPDATE' : 'SYSTEM.CREATE' })}
          </DialogTitle>
          <DialogDescription></DialogDescription>
          <button
            className="btn btn-sm btn-icon btn-light btn-outline absolute top-0 end-0 me-3 mt-3 lg:me-3 shadow-default"
            data-modal-dismiss="true"
            onClick={handleClose}
          >
            <KeenIcon icon="cross" />
          </button>
        </DialogHeader>
        <DialogBody className="py-0 mb-5 ps-5 pe-3 me-3">
          {isFormError &&
            formErrors.map((error, index) => <SharedError key={index} error={error as Error} />)}
          {isFormLoading ? (
            <SharedLoading simple />
          ) : (
            <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
              <SharedAutocomplete
                label={formatMessage({ id: 'SYSTEM.COMPANY' })}
                value={formik.values.company_id}
                options={
                  companyData?.result.map((item) => ({ ...item, name: item.company_name })) ?? []
                }
                placeholder={formatMessage({ id: 'SYSTEM.SELECT_COMPANY' })}
                searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_COMPANY' })}
                onChange={(val) => {
                  formik.setFieldValue('company_id', val);
                }}
                error={formik.errors.company_id as string}
                touched={formik.touched.company_id}
                searchTerm={searchCompanyTerm}
                onSearchTermChange={setSearchCompanyTerm}
              />
              <SharedSelect
                name="language_code"
                label={formatMessage({ id: 'SYSTEM.LANGUAGE' })}
                formik={formik}
                options={
                  languageData?.result?.map((lang) => ({ label: lang.name, value: lang.code })) ??
                  []
                }
              />
              <SharedSelect
                name="type"
                label={formatMessage({ id: 'SYSTEM.TYPE' })}
                formik={formik}
                options={
                  templateTypesOptions.map((type) => ({ label: type.name, value: type.value })) ??
                  []
                }
              />
              <SharedInput
                name="code"
                label={formatMessage({ id: 'SYSTEM.CODE' })}
                formik={formik}
              />
              <SharedInput
                name="title"
                label={formatMessage({ id: 'SYSTEM.TITLE' })}
                formik={formik}
              />
              <SharedInput
                name="subject"
                label={formatMessage({ id: 'SYSTEM.SUBJECT' })}
                formik={formik}
              />
              <SharedTextArea
                name="content"
                label={formatMessage({ id: 'SYSTEM.CONTENT' })}
                formik={formik}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || formik.isSubmitting}
                >
                  {formatMessage({ id: loading ? 'SYSTEM.PLEASE_WAIT' : 'SYSTEM.SAVE' })}
                </button>
              </div>
            </form>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
