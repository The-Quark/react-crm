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
import { IGlobalParamsPositionFormValues } from '@/api/post/postGlobalParams/postGlobalParamsPosition/types.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IGlobalParamsPositionModel } from '@/api/get/getGlobalParams/getGlobalParamsPositions/types.ts';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedTextArea
} from '@/partials/sharedUI';
import {
  getGlobalParameters,
  getGlobalParamsPositions,
  postGlobalParamsPosition,
  putGlobalParamsPosition
} from '@/api';
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  onOpenChange: () => void;
  id?: number;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('VALIDATION.TITLE_REQUIRED'),
  company_id: Yup.string().required('VALIDATION.COMPANY_REQUIRED'),
  description: Yup.string().optional(),
  is_active: Yup.boolean().required('VALIDATION.ACTIVE_STATUS_REQUIRED')
});

const getInitialValues = (
  isEditMode: boolean,
  data: IGlobalParamsPositionModel
): IGlobalParamsPositionFormValues => {
  if (isEditMode && data?.result) {
    return {
      title: data.result[0].title || '',
      company_id: data.result[0].company_id || '',
      description: data.result[0].description || '',
      is_active: data.result[0].is_active || true
    };
  }
  return {
    title: '',
    company_id: '',
    description: '',
    is_active: true
  };
};

export const PositionsModal: FC<Props> = ({ open, onOpenChange, id }) => {
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();

  const [loading, setLoading] = useState(false);
  const [searchCompanyTerm, setSearchCompanyTerm] = useState('');

  const {
    data: positionsData,
    isLoading: positionsLoading,
    isError: positionsIsError,
    error: positionsError
  } = useQuery({
    queryKey: ['formPositions', id],
    queryFn: () => getGlobalParamsPositions({ id: Number(id) }),
    enabled: !!id && open
  });

  const {
    data: companyData,
    isLoading: companyLoading,
    isError: companyIsError,
    error: companyError
  } = useQuery({
    queryKey: ['positionsCompany'],
    queryFn: () => getGlobalParameters(),
    staleTime: 1000 * 60 * 2,
    enabled: open
  });

  const formik = useFormik({
    initialValues: getInitialValues(!!id, positionsData as IGlobalParamsPositionModel),
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (id) {
          await putGlobalParamsPosition(Number(id), values);
        } else {
          await postGlobalParamsPosition(values);
        }
        resetForm();
        onOpenChange();
        queryClient.invalidateQueries({ queryKey: ['globalParamsPositions'] });
        setSearchCompanyTerm('');
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
    queryClient.removeQueries({ queryKey: ['formPositions'] });
    onOpenChange();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
            {id ? formatMessage({ id: 'SYSTEM.UPDATE' }) : formatMessage({ id: 'SYSTEM.CREATE' })}
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
          {companyIsError && <SharedError error={companyError} />}
          {id && positionsIsError && <SharedError error={positionsError} />}
          {positionsLoading || companyLoading ? (
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
              <SharedInput
                name="title"
                label={formatMessage({ id: 'SYSTEM.NAME' })}
                formik={formik}
              />
              <SharedTextArea
                name="description"
                label={formatMessage({ id: 'SYSTEM.DESCRIPTION' })}
                formik={formik}
              />

              {!!id && (
                <div className="flex  flex-wrap items-center lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">
                    {formatMessage({ id: 'SYSTEM.ACTIVE' })}
                  </label>
                  <div className="flex columns-1 w-full flex-wrap">
                    <div className="flex items-center gap-5">
                      <label className="checkbox-group flex items-center gap-2">
                        <input
                          className="checkbox"
                          type="checkbox"
                          name="is_active"
                          checked={formik.values.is_active}
                          onChange={(e) => formik.setFieldValue('is_active', e.target.checked)}
                        />
                      </label>
                    </div>
                    {formik.touched.is_active && formik.errors.is_active && (
                      <span role="alert" className="text-danger text-xs mt-1">
                        {formatMessage({ id: formik.errors.is_active })}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || formik.isSubmitting}
                >
                  {loading
                    ? formatMessage({ id: 'SYSTEM.PLEASE_WAIT' })
                    : formatMessage({ id: 'SYSTEM.SAVE' })}
                </button>
              </div>
            </form>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
