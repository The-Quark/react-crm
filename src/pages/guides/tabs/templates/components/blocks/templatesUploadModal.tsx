import React, { FC, useMemo, useState } from 'react';
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
import { getTemplates, getLanguages, postTemplateUpload, getFileTypes } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SharedError, SharedFileCard, SharedLoading, SharedSelect } from '@/partials/sharedUI';
import { Media } from '@/api/get/getGuides/getTemplates/types.ts';
import { AxiosError } from 'axios';
import Dropzone from 'shadcn-dropzone';
import { extToMime } from '@/lib/helpers.ts';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: number;
  selectedLanguage: string;
}

interface FormValues {
  type: string;
  files: File[];
  language_code: string;
}

export const TemplatesUploadModal: FC<Props> = ({ open, onOpenChange, id, selectedLanguage }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const formik = useFormik<FormValues>({
    initialValues: {
      type: '',
      files: [],
      language_code: selectedLanguage
    },
    validationSchema: Yup.object().shape({
      type: Yup.string()
        .required('Please select file type first and upload file')
        .test('type-selected-before-files', 'Please select file type first', function (value) {
          if (this.parent.files?.length > 0 && !value) {
            return false;
          }
          return true;
        }),
      files: Yup.array()
        .of(Yup.mixed<File>())
        .required('Files are required')
        .test('fileType', 'Unsupported file type', function (files) {
          if (!files || files.length === 0) return true;
          const selectedType = fileTypeData?.result?.find((t) => t.id === Number(this.parent.type));
          if (!selectedType) return false;

          return files.every((file) => {
            const extension = file?.name.split('.').pop()?.toLowerCase();
            return selectedType.types.map((t) => t.toLowerCase()).includes(extension || '');
          });
        }),
      language_code: Yup.string().required('Language is required')
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!id || values.files.length === 0) return;
      setLoading(true);
      try {
        await postTemplateUpload(Number(id), values.type, values.files, values.language_code);
        onOpenChange(false);
        queryClient.invalidateQueries({ queryKey: ['templateUpload', id] });
        resetForm();
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  const {
    data: templateData,
    isLoading: templateLoading,
    isError: templateIsError,
    error: templateError
  } = useQuery({
    queryKey: ['formUploadTemplate', id],
    queryFn: () => getTemplates({ id: Number(id), language_code: selectedLanguage }),
    enabled: !!id && open
  });

  const {
    data: languageData,
    isLoading: languageLoading,
    isError: languageIsError,
    error: languageError
  } = useQuery({
    queryKey: ['templatesLanguage'],
    queryFn: () => getLanguages({}),
    staleTime: 1000 * 60 * 2,
    enabled: open
  });

  const {
    data: fileTypeData,
    isLoading: fileTypeLoading,
    isError: fileTypeIsError,
    error: fileTypeError
  } = useQuery({
    queryKey: ['templatesFileType'],
    queryFn: () => getFileTypes({}),
    staleTime: 1000 * 60 * 2,
    enabled: open
  });

  const selectedFileType = useMemo(() => {
    return fileTypeData?.result?.find((type) => String(type.id) === String(formik.values.type));
  }, [formik.values.type, fileTypeData]);

  const acceptedFileTypes = useMemo(() => {
    if (!selectedFileType) return undefined;

    const acceptMap: Record<string, string[]> = {};

    selectedFileType.types.forEach((ext) => {
      const lowerExt = ext.toLowerCase();
      const mime = extToMime[lowerExt];
      if (!mime) return;
      if (!acceptMap[mime]) acceptMap[mime] = [];
      acceptMap[mime].push(`.${lowerExt}`);
    });

    return acceptMap;
  }, [selectedFileType]);

  const handleClose = () => {
    formik.resetForm();
    onOpenChange(false);
  };

  const handleFileChange = (acceptedFiles: File[]) => {
    formik.setFieldValue('files', acceptedFiles);
  };

  const handleOpenFile = (url: string, mimeType: string) => {
    if (mimeType.startsWith('image/') || mimeType === 'application/pdf') {
      window.open(url, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.download = '';
      link.target = '_blank';
      link.click();
    }
  };

  const isFormLoading = id
    ? templateLoading || languageLoading || fileTypeLoading
    : languageLoading || fileTypeLoading;

  const isFormError = id
    ? templateIsError || languageIsError || fileTypeIsError
    : languageIsError || fileTypeIsError;

  const formErrors = [templateError, languageError, fileTypeError].filter(
    (error) => error !== null
  );

  console.log('types: ', acceptedFileTypes);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
            Upload Documents/Photos
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
                label="File type"
                formik={formik}
                options={
                  fileTypeData?.result?.map((file) => ({ label: file.name, value: file.id })) ?? []
                }
                placeholder="Select upload type"
                onChange={(value: string | number) => {
                  formik.setFieldValue('type', value);
                  formik.setFieldValue('files', []);
                }}
              />

              <div className="flex flex-col gap-2.5">
                <label className="form-label">Files</label>
                {selectedFileType && (
                  <p className="text-sm text-gray-500">
                    Allowed file types: {selectedFileType.types.join(', ')}
                  </p>
                )}
                <Dropzone
                  containerClassName="w-full h-full"
                  dropZoneClassName="w-full h-40 border-2 border-dashed rounded-lg flex items-center justify-center"
                  multiple={true}
                  accept={acceptedFileTypes}
                  onDrop={handleFileChange}
                  disabled={!formik.values.type}
                  noClick={!formik.values.type}
                />
                {formik.touched.files && formik.errors.files && (
                  <p className="text-red-500 text-sm">{formik.errors.files as string}</p>
                )}
              </div>

              {formik.values.files.length > 0 && (
                <div className="grid gap-2">
                  <h4 className="font-medium">Files to upload</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {formik.values.files.map((file, index) => (
                      <SharedFileCard
                        key={`new-${index}`}
                        file={{
                          id: index,
                          name: file.name,
                          size: file.size,
                          mime_type: file.type,
                          original_url: URL.createObjectURL(file)
                        }}
                        onClick={() => handleOpenFile(URL.createObjectURL(file), file.type)}
                        isNew={true}
                      />
                    ))}
                  </div>
                </div>
              )}

              {templateData?.result?.[0]?.language?.find(
                (l) => l.crm_language.code === selectedLanguage
              )?.file && (
                <div className="grid gap-2">
                  <h4 className="font-medium">Uploaded files</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <SharedFileCard
                      key={
                        templateData.result[0].language.find(
                          (l) => l.crm_language.code === selectedLanguage
                        )?.file.id
                      }
                      file={
                        templateData.result[0].language.find(
                          (l) => l.crm_language.code === selectedLanguage
                        )?.file as Media
                      }
                      onClick={() =>
                        handleOpenFile(
                          templateData.result[0].language.find(
                            (l) => l.crm_language.code === selectedLanguage
                          )?.file.original_url ?? '',
                          templateData.result[0].language.find(
                            (l) => l.crm_language.code === selectedLanguage
                          )?.file.mime_type ?? ''
                        )
                      }
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2.5">
                <button type="button" className="btn btn-light" onClick={handleClose}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || formik.isSubmitting}
                >
                  {loading ? 'Uploading...' : 'Upload Files'}
                </button>
              </div>
            </form>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
