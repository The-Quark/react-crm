import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import Dropzone from 'shadcn-dropzone';
import { getCargo, postCargoUpload } from '@/api';
import { UploadType } from '@/api/post/postWorkflow/postCargoUpload/types.ts';
import { SharedError, SharedFileCard, SharedLoading, SharedSelect } from '@/partials/sharedUI';

export const formSchema = Yup.object().shape({
  type: Yup.string().required('Type is required'),
  files: Yup.mixed()
    .required('Files are required')
    .test('fileSize', 'File size is too large', (value) => {
      if (!value) return true;
      const files = Array.isArray(value) ? value : [value];
      return files.every((file) => file.size <= 5 * 1024 * 1024);
    })
    .test('fileType', 'Unsupported file type', (value) => {
      if (!value) return true;
      const files = Array.isArray(value) ? value : [value];
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      return files.every((file) => allowedTypes.includes(file.type));
    })
});

export const CargoUploadContent = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const formik = useFormik({
    initialValues: {
      type: 'photo' as UploadType,
      files: [] as File[]
    },
    validationSchema: formSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!id || values.files.length === 0) return;

      try {
        await postCargoUpload(Number(id), values.type, values.files);
        queryClient.invalidateQueries({ queryKey: ['cargoUpload', id] });
        resetForm();
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error(error.response?.data?.message || error.message);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleFileChange = (acceptedFiles: File[]) => {
    formik.setFieldValue('files', acceptedFiles);
  };

  const handleOpenFile = (url: string, mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      window.open(url, '_blank');
    } else if (mimeType === 'application/pdf') {
      window.open(url, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.download = '';
      link.target = '_blank';
      link.click();
    }
  };

  const uploadTypeOptions = [
    { value: 'photo', label: 'Photo' },
    { value: 'invoice_doc', label: 'Invoice Document' },
    { value: 'other', label: 'Other Document' }
  ];

  if (cargoLoading) return <SharedLoading />;
  if (cargoIsError) return <SharedError error={cargoError as Error} />;

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
            options={uploadTypeOptions}
            placeholder="Select upload type"
          />

          <div className="flex flex-col gap-2.5">
            <label className="form-label">Files</label>
            <Dropzone
              containerClassName="w-full h-full"
              dropZoneClassName="w-full h-40 border-2 border-dashed rounded-lg flex items-center justify-center"
              multiple={true}
              accept={{
                'image/*': ['.jpeg', '.jpg', '.png'],
                'application/pdf': ['.pdf']
              }}
              onDrop={handleFileChange}
            />
            {formik.touched.files && formik.errors.files && (
              <p className="text-red-500 text-sm">
                {typeof formik.errors.files === 'string' ? formik.errors.files : null}
              </p>
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
