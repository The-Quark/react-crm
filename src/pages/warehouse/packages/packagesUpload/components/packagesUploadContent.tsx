import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import Dropzone from 'shadcn-dropzone';
import { getFileTypes, getPackages, postPackageUpload } from '@/api';
import { SharedError, SharedFileCard, SharedLoading, SharedSelect } from '@/partials/sharedUI';
import { extToMime } from '@/utils/lib/helpers.ts';
import { useIntl } from 'react-intl';

interface FormValues {
  type: string;
  files: File[];
}

export const PackagesUploadContent = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const formik = useFormik<FormValues>({
    initialValues: {
      type: '',
      files: []
    },
    validationSchema: Yup.object().shape({
      type: Yup.string()
        .required('VALIDATION.FILE_TYPE_REQUIRED')
        .test('type-selected-before-files', 'VALIDATION.FILE_TYPE_BEFORE_FILES', function (value) {
          if (this.parent.files?.length > 0 && !value) {
            return false;
          }
          return true;
        }),
      files: Yup.array()
        .of(Yup.mixed<File>())
        .required('VALIDATION.FILES_REQUIRED')
        .test('fileType', 'VALIDATION.UNSUPPORTED_FILE_TYPE', function (files) {
          if (!files || files.length === 0) return true;
          const selectedType = fileTypeData?.result?.find((t) => t.id === Number(this.parent.type));
          if (!selectedType) return false;

          return files.every((file) => {
            const extension = file?.name.split('.').pop()?.toLowerCase();
            return selectedType.types.map((t) => t.toLowerCase()).includes(extension || '');
          });
        })
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!id || values.files.length === 0) return;

      try {
        await postPackageUpload(Number(id), values.type, values.files);
        queryClient.invalidateQueries({ queryKey: ['packageUpload', id] });
        navigate('/warehouse/packages/list');
        resetForm();
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error(error.response?.data?.message || error.message);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const {
    data: packageData,
    isLoading: packageLoading,
    isError: packageIsError,
    error: packageError
  } = useQuery({
    queryKey: ['packageUpload', id],
    queryFn: () => getPackages({ id: id ? parseInt(id) : undefined }),
    enabled: !!id
  });

  const {
    data: fileTypeData,
    isLoading: fileTypeLoading,
    isError: fileTypeIsError,
    error: fileTypeError
  } = useQuery({
    queryKey: ['packagesFileType'],
    queryFn: () => getFileTypes({})
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

  if (packageLoading || fileTypeLoading) return <SharedLoading />;
  if (packageIsError) return <SharedError error={packageError as Error} />;
  if (fileTypeIsError) return <SharedError error={fileTypeError as Error} />;

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-header" id="general_settings">
          <h3 className="card-title">{formatMessage({ id: 'SYSTEM.UPLOAD_DOCUMENTS_PHOTOS' })}</h3>
        </div>

        <div className="card-body grid gap-5">
          <SharedSelect
            name="type"
            label={formatMessage({ id: 'SYSTEM.FILE_TYPE' })}
            formik={formik}
            options={
              fileTypeData?.result?.map((file) => ({ label: file.name, value: file.id })) ?? []
            }
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_UPLOAD_TYPE' })}
            onChange={(value: string | number) => {
              formik.setFieldValue('type', value);
              formik.setFieldValue('files', []);
            }}
          />

          <div className="flex flex-col gap-2.5">
            <label className="form-label">{formatMessage({ id: 'SYSTEM.FILES' })}</label>
            {selectedFileType && (
              <p className="text-sm text-gray-500">
                {formatMessage({ id: 'SYSTEM.ALLOWED_FILE_TYPES' })}:{' '}
                {selectedFileType.types.join(', ')}
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
              <p className="text-red-500 text-sm">
                {formatMessage({ id: formik.errors.files as string })}
              </p>
            )}
          </div>

          {formik.values.files.length > 0 && (
            <div className="grid gap-2">
              <h4 className="font-medium">{formatMessage({ id: 'SYSTEM.FILES_TO_UPLOAD' })}</h4>
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

          {packageData?.result?.[0]?.media && packageData.result[0].media.length > 0 && (
            <div className="grid gap-2">
              <h4 className="font-medium">{formatMessage({ id: 'SYSTEM.UPLOADED_FILES' })}:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {packageData.result[0].media.map((media) => (
                  <SharedFileCard
                    key={media.id}
                    file={media}
                    onClick={() => handleOpenFile(media.original_url, media.mime_type)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2.5">
            <button type="button" className="btn btn-light" onClick={() => navigate(-1)}>
              {formatMessage({ id: 'SYSTEM.CANCEL' })}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formik.isSubmitting || formik.values.files.length === 0}
            >
              {formik.isSubmitting
                ? formatMessage({ id: 'SYSTEM.UPLOADING' })
                : formatMessage({ id: 'SYSTEM.UPLOAD_FILES' })}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
