import { getOrders, getPackages, getUserList, postTask, putTask, useCurrentUser } from '@/api';
import { ITaskFormValues } from '@/api/post/postTask/types.ts';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { FC, useEffect, useState } from 'react';
import {
  SharedAutocomplete,
  SharedDateDayPicker,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedSelect,
  SharedTextArea
} from '@/partials/sharedUI';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TaskPriority, TaskStatus, TaskType } from '@/api/enums';
import {
  taskPriorityOptions,
  taskStatusOptions,
  taskTypeOptions
} from '@/utils/enumsOptions/mocks.ts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/utils/lib/utils.ts';
import { KeenIcon } from '@/components';
import { CalendarDate } from '@/components/ui/calendarDate.tsx';
import { Task } from '@/api/get/getTask/types.ts';
import { useIntl } from 'react-intl';
import { DEFAULT_SEARCH_PAGE_NUMBER } from '@/utils';

interface Props {
  isEditMode: boolean;
  taskData?: Task;
  taskId?: number;
}

export const formSchema = Yup.object().shape({
  description: Yup.string().required('VALIDATION.DESCRIPTION_REQUIRED'),
  type: Yup.mixed<TaskType>().oneOf(Object.values(TaskType)).required('VALIDATION.TYPE_REQUIRED'),
  priority: Yup.mixed<TaskPriority>()
    .oneOf(Object.values(TaskPriority))
    .required('VALIDATION.PRIORITY_REQUIRED'),
  status: Yup.mixed<TaskStatus>().oneOf(Object.values(TaskStatus)).optional(),
  assigned_by: Yup.number().integer().required('VALIDATION.ASSIGNED_BY_REQUIRED'),
  assigned_to: Yup.number().integer().required('VALIDATION.ASSIGNED_TO_REQUIRED'),
  order_id: Yup.string().optional(),
  package_id: Yup.string().optional(),
  due_date: Yup.string().required('VALIDATION.DUE_DATE_REQUIRED')
});

export const TasksStarterContent: FC<Props> = ({ taskId, taskData, isEditMode }) => {
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderIdFromOrders = searchParams.get('order_id');
  const packageIdFromPackages = searchParams.get('package_id');
  const { data: currentUser } = useCurrentUser();

  const [loading, setLoading] = useState(false);
  const [searchOrderTerm, setSearchOrderTerm] = useState('');
  const [searchPackageTerm, setSearchPackageTerm] = useState('');
  const [searchUserTerm, setSearchUserTerm] = useState('');

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersIsError,
    error: ordersError
  } = useQuery({
    queryKey: ['tasksOrders', searchOrderTerm],
    queryFn: () => getOrders({ searchorder: searchOrderTerm, per_page: DEFAULT_SEARCH_PAGE_NUMBER })
  });

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersIsError,
    error: usersError
  } = useQuery({
    queryKey: ['tasksUsers', searchUserTerm],
    queryFn: () => getUserList({ full_name: searchOrderTerm, per_page: DEFAULT_SEARCH_PAGE_NUMBER })
  });

  const {
    data: packagesData,
    isLoading: packagesLoading,
    isError: packagesIsError,
    error: packagesError
  } = useQuery({
    queryKey: ['tasksPackages', searchPackageTerm],
    queryFn: () => getPackages({ hawb: searchOrderTerm, per_page: DEFAULT_SEARCH_PAGE_NUMBER })
  });

  const initialValues: ITaskFormValues & { status?: TaskStatus } = {
    assigned_by: currentUser?.id || '',
    assigned_to: '',
    description: '',
    due_date: '',
    order_id: orderIdFromOrders || '',
    package_id: packageIdFromPackages || '',
    priority: TaskPriority.LOW,
    title: '',
    type: TaskType.INNER,
    ...(isEditMode && { status: TaskStatus.TODO as unknown as TaskStatus })
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        if (isEditMode && taskId) {
          await putTask(Number(taskId), values);
        } else {
          await postTask(values);
        }
        navigate('/tasks/list');
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        resetForm();
        setSearchUserTerm('');
        setSearchUserTerm('');
        setSearchPackageTerm('');
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error(error.response?.data?.message || error.message);
      }
      setLoading(false);
      setSubmitting(false);
    }
  });

  useEffect(() => {
    formik.resetForm();
    if (taskData && isEditMode) {
      formik.setValues(
        {
          title: taskData.title ?? '',
          description: taskData.description,
          type: taskData.type ?? TaskType.INNER,
          priority: taskData.priority ?? TaskPriority.LOW,
          order_id: taskData.order_id ?? '',
          assigned_to: taskData.assigned_to.id ?? '',
          assigned_by: taskData.assigned_by.id ?? '',
          package_id: taskData.package_id ?? '',
          due_date: taskData.due_date ?? '',
          status: taskData.status as unknown as TaskStatus
        },
        false
      );
    }
  }, [isEditMode, taskData]);

  if (packagesLoading || usersLoading) {
    return <SharedLoading />;
  }

  if (ordersIsError) {
    return <SharedError error={ordersError} />;
  }

  if (usersIsError) {
    return <SharedError error={usersError} />;
  }

  if (packagesIsError) {
    return <SharedError error={packagesError} />;
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-header" id="general_settings">
          <h3 className="card-title">
            {isEditMode
              ? formatMessage({ id: 'SYSTEM.EDIT_TASK' })
              : formatMessage({ id: 'SYSTEM.NEW_TASK' })}
          </h3>
        </div>

        <div className="card-body grid gap-5">
          {isEditMode && (
            <SharedInput
              name="title"
              label={formatMessage({ id: 'SYSTEM.TASK' })}
              formik={formik}
              disabled
            />
          )}

          <SharedSelect
            name="type"
            label={formatMessage({ id: 'SYSTEM.TYPE' })}
            formik={formik}
            options={taskTypeOptions.map((option) => ({
              label: option.name,
              value: option.value
            }))}
          />

          <SharedSelect
            name="priority"
            label={formatMessage({ id: 'SYSTEM.PRIORITY' })}
            formik={formik}
            options={taskPriorityOptions.map((option) => ({
              label: option.name,
              value: option.value
            }))}
          />

          <SharedDateDayPicker
            name="due_date"
            label={formatMessage({ id: 'SYSTEM.DUE_DATE' })}
            formik={formik}
          />

          <SharedTextArea
            name="description"
            label={formatMessage({ id: 'SYSTEM.DESCRIPTION' })}
            formik={formik}
          />

          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.ASSIGNED_TO' })}
            value={formik.values.assigned_to ?? ''}
            options={
              usersData?.result?.map((app) => ({
                id: app.id,
                name: `${app.first_name} ${app.last_name} ${app.patronymic}`
              })) ?? []
            }
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_USER' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_USER' })}
            onChange={(val) => {
              formik.setFieldValue('assigned_to', val);
            }}
            error={formik.errors.assigned_to as string}
            touched={formik.touched.assigned_to}
            searchTerm={searchUserTerm}
            onSearchTermChange={setSearchUserTerm}
          />

          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.ORDER' })}
            value={formik.values.order_id ?? ''}
            options={
              ordersData?.result?.map((app) => ({
                id: app.id,
                name: app.order_code
              })) ?? []
            }
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_ORDER' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_ORDER' })}
            onChange={(val) => {
              formik.setFieldValue('order_id', val);
            }}
            error={formik.errors.order_id as string}
            touched={formik.touched.order_id}
            searchTerm={searchOrderTerm}
            onSearchTermChange={setSearchOrderTerm}
            loading={ordersLoading}
          />

          <SharedAutocomplete
            label={formatMessage({ id: 'SYSTEM.PACKAGE' })}
            value={formik.values.package_id ?? ''}
            options={
              packagesData?.result?.map((app) => ({
                id: app.id,
                name: app.hawb
              })) ?? []
            }
            placeholder={formatMessage({ id: 'SYSTEM.SELECT_PACKAGE' })}
            searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_PACKAGE' })}
            onChange={(val) => {
              formik.setFieldValue('package_id', val);
            }}
            error={formik.errors.package_id as string}
            touched={formik.touched.package_id}
            searchTerm={searchPackageTerm}
            onSearchTermChange={setSearchPackageTerm}
          />

          {isEditMode && (
            <SharedSelect
              name="status"
              label={formatMessage({ id: 'SYSTEM.STATUS' })}
              formik={formik}
              options={taskStatusOptions.map((option) => ({
                label: option.name,
                value: option.value
              }))}
            />
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
        </div>
      </form>
    </div>
  );
};
