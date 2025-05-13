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
  SharedSelect
} from '@/partials/sharedUI';
import { ITemplatesResponse } from '@/api/get/getTemplates/types.ts';
import { ITemplatesFormValues } from '@/api/post/postTemplate/types.ts';
import { templateTypesOptions } from '@/lib/mocks.ts';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: number;
}

const validateSchema = Yup.object({
  company_id: Yup.string().required('Company is required'),
  language_code: Yup.string().required('Language code is required'),
  code: Yup.string().required('Code is required'),
  type: Yup.string().required('Type is required'),
  title: Yup.string().required('Title is required'),
  subject: Yup.string().required('Subject is required'),
  content: Yup.string().required('Content is required')
});

const getInitialValues = (
  isEditMode: boolean,
  templaTtesData: ITemplatesResponse
): ITemplatesFormValues => {
  if (isEditMode && templaTtesData?.result) {
    const data = templaTtesData.result[0];
    return {
      company_id: String(data.company_id) || '',
      language_code: String(data.language) || '',
      code: data.code || '',
      type: data.type || '',
      content: data.type || '',
      subject: data.type || '',
      title: data.type || ''
    };
  }
  return {
    company_id: '',
    language_code: '',
    code: '',
    type: '',
    content: '',
    subject: '',
    title: ''
  };
};

export const TemplatesModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const [loading, setLoading] = useState(false);
  const [searchCompanyTerm, setSearchCompanyTerm] = useState('');

  const queryClient = useQueryClient();

  const {
    data: templateData,
    isLoading: templateLoading,
    isError: templateIsError,
    error: templateError
  } = useQuery({
    queryKey: ['formTemplate', id],
    queryFn: () => getTemplates(Number(id)),
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
    staleTime: 1000 * 60 * 2,
    enabled: open
  });

  const {
    data: languageData,
    isLoading: languageLoading,
    isError: languageIsError,
    error: languageError
  } = useQuery({
    queryKey: ['templatesLanguage'],
    queryFn: () => getLanguages(),
    staleTime: 1000 * 60 * 2,
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
            {id ? 'Update' : 'Create'}
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
                label="Company"
                value={formik.values.company_id}
                options={
                  companyData?.result.map((item) => ({ ...item, name: item.company_name })) ?? []
                }
                placeholder="Select company"
                searchPlaceholder="Search company"
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
                label="Language"
                formik={formik}
                options={
                  languageData?.result?.map((lang) => ({ label: lang.name, value: lang.code })) ??
                  []
                }
              />
              <SharedSelect
                name="type"
                label="Type"
                formik={formik}
                options={
                  templateTypesOptions.map((type) => ({ label: type.name, value: type.value })) ??
                  []
                }
              />
              <SharedInput name="code" label="Code" formik={formik} />
              <SharedInput name="title" label="Title" formik={formik} />
              <SharedInput name="subject" label="Subject" formik={formik} />
              <SharedInput name="content" label="Contrent" formik={formik} />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || formik.isSubmitting}
                >
                  {loading ? 'Please wait...' : 'Save'}
                </button>
              </div>
            </form>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
