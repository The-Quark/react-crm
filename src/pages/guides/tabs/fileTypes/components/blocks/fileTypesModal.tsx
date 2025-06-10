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
import { getFileTypes, putFileType, postFileType } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SharedError, SharedInput, SharedInputTags, SharedLoading } from '@/partials/sharedUI';
import { FileTypesResponse } from '@/api/get/getGuides/getFileTypes/types.ts';
import { IFileTypeFormValues } from '@/api/post/postGuides/postFileType/types.ts';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  types: Yup.array()
    .of(Yup.string().required())
    .min(1, 'At least one type must be selected')
    .required('Types is required'),
  step: Yup.number().required('Step is required')
});

const getInitialValues = (isEditMode: boolean, data: FileTypesResponse): IFileTypeFormValues => {
  if (isEditMode && data?.result) {
    return {
      name: data.result[0].name || '',
      step: data.result[0].step || 0,
      types: data.result[0].types || []
    };
  }
  return {
    name: '',
    step: 0,
    types: []
  };
};

const FileTypeModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: fileTypeData,
    isLoading: fileTypeLoading,
    isError: fileTypeIsError,
    error: fileTypeError
  } = useQuery({
    queryKey: ['formFileTypes', id],
    queryFn: () => getFileTypes({ id: Number(id) }),
    enabled: !!id && open
  });

  const formik = useFormik({
    initialValues: getInitialValues(!!id, fileTypeData as FileTypesResponse),
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (id) {
          await putFileType(Number(id), values);
        } else {
          await postFileType(values);
        }
        resetForm();
        onOpenChange();
        queryClient.invalidateQueries({ queryKey: ['guidesFileTypes'] });
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
    queryClient.removeQueries({ queryKey: ['formSources'] });
    onOpenChange();
  };

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
          {id && fileTypeIsError && <SharedError error={fileTypeError} />}
          {fileTypeLoading ? (
            <SharedLoading simple />
          ) : (
            <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
              <SharedInput name="name" label="Name" formik={formik} />
              <SharedInput name="step" label="Step" formik={formik} type="number" />

              <SharedInputTags
                value={
                  Array.isArray(formik.values?.types)
                    ? (formik.values?.types.filter(
                        (v): v is string => typeof v === 'string'
                      ) as string[])
                    : typeof formik.values?.types === 'string'
                      ? [formik.values.types]
                      : []
                }
                onChange={(value) =>
                  formik.setFieldValue('types', value as typeof formik.values.types)
                }
                label="Types"
                error={formik.errors.types as string}
                touched={formik.touched.types}
              />

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

export default FileTypeModal;
