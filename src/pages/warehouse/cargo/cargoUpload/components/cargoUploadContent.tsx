import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import Dropzone from 'shadcn-dropzone';
import { getCargo, getFileTypes, postCargoUpload } from '@/api';
import { SharedError, SharedFileCard, SharedLoading, SharedSelect } from '@/partials/sharedUI';
import { extToMime } from '@/lib/helpers.ts';

interface FormValues {
  type: string;
  files: File[];
}

export const CargoUploadContent = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const formik = useFormik<FormValues>({
    initialValues: {
      type: '',
      files: []
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
        })
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!id || values.files.length === 0) return;

      try {
        await postCargoUpload(Number(id), values.type, values.files);
        queryClient.invalidateQueries({ queryKey: ['cargoUpload', id] });
        navigate('/warehouse/cargo/list');
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
    data: cargoData,
    isLoading: cargoLoading,
    isError: cargoIsError,
    error: cargoError
  } = useQuery({
    queryKey: ['cargoUpload', id],
    queryFn: () => getCargo({ id: id ? parseInt(id) : undefined }),
    enabled: !!id
  });

  const {
    data: fileTypeData,
    isLoading: fileTypeLoading,
    isError: fileTypeIsError,
    error: fileTypeError
  } = useQuery({
    queryKey: ['packagesFileType'],
    queryFn: () => getFileTypes({}),
    staleTime: 1000 * 60 * 2
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

  if (cargoLoading || fileTypeLoading) return <SharedLoading />;
  if (cargoIsError) return <SharedError error={cargoError as Error} />;
  if (fileTypeIsError) return <SharedError error={fileTypeError as Error} />;

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-header" id="general_settings">
          <h3 className="card-title">Upload Documents/Photos</h3>
        </div>

        <div className="card-body grid gap-5">
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

          {cargoData?.result?.[0]?.media && cargoData.result[0].media.length > 0 && (
            <div className="grid gap-2">
              <h4 className="font-medium">Uploaded files:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cargoData.result[0].media.map((media) => (
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
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formik.isSubmitting || formik.values.files.length === 0}
            >
              {formik.isSubmitting ? 'Uploading...' : 'Upload Files'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
