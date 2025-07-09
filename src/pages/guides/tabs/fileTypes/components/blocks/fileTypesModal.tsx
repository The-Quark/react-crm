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
import {
  SharedError,
  SharedInput,
  SharedInputTags,
  SharedLoading,
  SharedSelect
} from '@/partials/sharedUI';
import { FileTypesResponse } from '@/api/get/getGuides/getFileTypes/types.ts';
import { IFileTypeFormValues } from '@/api/post/postGuides/postFileType/types.ts';
import { useIntl } from 'react-intl';
import { mockDeliveryCategories, mockEntityTypes } from '@/utils';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('VALIDATION.NAME_REQUIRED'),
  types: Yup.array()
    .of(Yup.string().required())
    .min(1, 'VALIDATION.TYPES_MIN')
    .required('VALIDATION.TYPES_REQUIRED'),
  step: Yup.number().required('VALIDATION.STEP_REQUIRED')
});

const getInitialValues = (isEditMode: boolean, data: FileTypesResponse): IFileTypeFormValues => {
  if (isEditMode && data?.result) {
    const dataResult = data.result[0];
    return {
      name: dataResult.name || '',
      step: dataResult.step || 0,
      types: dataResult.types || [],
      entity_type: dataResult.entity_type || ''
    };
  }
  return {
    name: '',
    step: 0,
    types: [],
    entity_type: ''
  };
};

const FileTypeModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(false);

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
          {id && fileTypeIsError && <SharedError error={fileTypeError} />}
          {fileTypeLoading ? (
            <SharedLoading simple />
          ) : (
            <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
              <SharedInput
                name="name"
                label={formatMessage({ id: 'SYSTEM.NAME' })}
                formik={formik}
              />
              <SharedInput
                name="step"
                label={formatMessage({ id: 'SYSTEM.STEP' })}
                formik={formik}
                type="number"
              />

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
                label={formatMessage({ id: 'SYSTEM.TYPES' })}
                error={formik.errors.types as string}
                touched={formik.touched.types}
              />

              <SharedSelect
                name="entity_type"
                label={formatMessage({ id: 'SYSTEM.ENTITY_TYPE' })}
                placeholder={formatMessage({ id: 'SYSTEM.SELECT_ENTITY_TYPE' })}
                formik={formik}
                isClearable
                options={mockEntityTypes.map((entity) => ({
                  label: entity.name,
                  value: entity.value
                }))}
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

export default FileTypeModal;
