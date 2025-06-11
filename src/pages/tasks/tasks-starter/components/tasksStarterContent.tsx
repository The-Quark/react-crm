import { getOrders, getPackages, getUserList, postTask, putTask, useCurrentUser } from '@/api';
import { ITaskFormValues } from '@/api/post/postTask/types.ts';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { FC, useEffect, useState } from 'react';
import {
  SharedAutocomplete,
  SharedError,
  SharedInput,
  SharedLoading,
  SharedSelect
} from '@/partials/sharedUI';
import { useNavigate } from 'react-router-dom';
import { TaskPriority, TaskStatus, TaskType } from '@/api/enums';
import { Textarea } from '@/components/ui/textarea.tsx';
import { taskPriorityOptions, taskStatusOptions, taskTypeOptions } from '@/lib/mocks.ts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import { KeenIcon } from '@/components';
import { CalendarDate } from '@/components/ui/calendarDate.tsx';
import { getData, setData } from '@/utils/include/LocalStorage';
import { Task } from '@/api/get/getTask/types.ts';

interface Props {
  isEditMode: boolean;
  taskData?: Task;
  taskId?: number;
}

export const formSchema = Yup.object().shape({
  title: Yup.string().optional(),
  description: Yup.string().required('Description is required'),
  type: Yup.mixed<TaskType>().oneOf(Object.values(TaskType)).required('Type is required'),
  priority: Yup.mixed<TaskPriority>()
    .oneOf(Object.values(TaskPriority))
    .required('Priority is required'),
  status: Yup.mixed<TaskStatus>().oneOf(Object.values(TaskStatus)).optional(),
  assigned_by: Yup.number().integer().required('Assigned by is required'),
  assigned_to: Yup.number().integer().required('Assigned to is required'),
  order_id: Yup.number().integer().nullable(),
  package_id: Yup.number().integer().nullable(),
  due_date: Yup.string().required('Due date is required')
});

export const TasksStarterContent: FC<Props> = ({ taskId, taskData, isEditMode }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchOrderTerm, setSearchOrderTerm] = useState('');
  const [searchPackageTerm, setSearchPackageTerm] = useState('');
  const [searchUserTerm, setSearchUserTerm] = useState('');
  const orderIdFromOrders = getData('orderIdFromOrders') ? getData('orderIdFromOrders') : '';
  const { data: currentUser } = useCurrentUser();

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersIsError,
    error: ordersError
  } = useQuery({
    queryKey: ['tasksOrders', searchOrderTerm],
    queryFn: () => getOrders({ searchorder: searchOrderTerm, per_page: 50 }),
    staleTime: 60 * 60 * 1000
  });

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersIsError,
    error: usersError
  } = useQuery({
    queryKey: ['tasksUsers', searchUserTerm],
    queryFn: () => getUserList({ full_name: searchOrderTerm, per_page: 50 }),
    staleTime: 60 * 60 * 1000
  });

  const {
    data: packagesData,
    isLoading: packagesLoading,
    isError: packagesIsError,
    error: packagesError
  } = useQuery({
    queryKey: ['tasksPackages', searchPackageTerm],
    queryFn: () => getPackages({ hawb: searchOrderTerm, per_page: 50 }),
    staleTime: 60 * 60 * 1000
  });

  const initialValues: ITaskFormValues & { status?: TaskStatus } = {
    assigned_by: currentUser?.id || '',
    assigned_to: '',
    description: '',
    due_date: '',
    order_id: String(orderIdFromOrders) || '',
    package_id: '',
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
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          navigate('/tasks/list');
          resetForm();
        } else {
          await postTask(values);
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          navigate('/tasks/list');
          resetForm();
        }
        setData('orderIdFromOrders', '');
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
          <h3 className="card-title">{isEditMode ? 'Edit Task' : 'New Task'}</h3>
        </div>

        <div className="card-body grid gap-5">
          <SharedInput name="title" label="Title" formik={formik} />

          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Description</label>
            <div className="flex columns-1 w-full flex-wrap">
              <Textarea
                rows={4}
                placeholder="Description"
                {...formik.getFieldProps('description')}
              />
              {formik.touched.description && formik.errors.description && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.description}
                </span>
              )}
            </div>
          </div>

          <SharedSelect
            name="type"
            label="Type"
            formik={formik}
            options={taskTypeOptions.map((option) => ({
              label: option.name,
              value: option.value
            }))}
          />

          <SharedSelect
            name="priority"
            label="Priority"
            formik={formik}
            options={taskPriorityOptions.map((option) => ({
              label: option.name,
              value: option.value
            }))}
          />

          <div className="w-full">
            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label flex- items-center gap-1 max-w-56">Due date</label>
              <div className="w-full flex columns-1 flex-wrap">
                <Popover>
                  <PopoverTrigger asChild>
                    <button id="date" className={cn('input data-[state=open]:border-primary')}>
                      <KeenIcon icon="calendar" className="-ms-0.5" />
                      <span>
                        {formik.values.due_date
                          ? new Date(formik.values.due_date).toLocaleDateString()
                          : 'Pick a date'}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarDate
                      initialFocus
                      mode="single"
                      captionLayout="dropdown"
                      fromYear={new Date().getFullYear()}
                      toYear={new Date().getFullYear() + 1}
                      defaultMonth={new Date()}
                      selected={formik.getFieldProps('due_date').value}
                      onSelect={(value) => formik.setFieldValue('due_date', value)}
                    />
                  </PopoverContent>
                </Popover>
                {formik.touched.due_date && formik.errors.due_date && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.due_date}
                  </span>
                )}
              </div>
            </div>
          </div>

          <SharedAutocomplete
            label="Assigned to"
            value={formik.values.assigned_to ?? ''}
            options={
              usersData?.result?.map((app) => ({
                id: app.id,
                name: `${app.first_name} ${app.last_name} ${app.patronymic}`
              })) ?? []
            }
            placeholder="Select user"
            searchPlaceholder="Search user"
            onChange={(val) => {
              formik.setFieldValue('assigned_to', val);
            }}
            error={formik.errors.assigned_to as string}
            touched={formik.touched.assigned_to}
            searchTerm={searchUserTerm}
            onSearchTermChange={setSearchUserTerm}
          />

          <SharedAutocomplete
            label="Order"
            value={formik.values.order_id ?? ''}
            options={
              ordersData?.result?.map((app) => ({
                id: app.id,
                name: app.order_code
              })) ?? []
            }
            placeholder="Select order"
            searchPlaceholder="Search order"
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
            label="Package"
            value={formik.values.package_id ?? ''}
            options={
              packagesData?.result?.map((app) => ({
                id: app.id,
                name: app.hawb
              })) ?? []
            }
            placeholder="Select package"
            searchPlaceholder="Search package"
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
              label="Status"
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
              {loading ? 'Please wait...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
