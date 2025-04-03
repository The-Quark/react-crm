import { FC, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { PHONE_REG_EXP } from '@/utils/include/phone.ts';
import { AxiosError } from 'axios';
import { IImageInputFile } from '@/components/image-input';
import { postUpdateUser } from '@/pages/crm/member-update/components/blocks/memberUpdatePostUserApi.ts';
import { UserModel } from '@/api/getMemberById/types.ts';
import { CrudAvatarUpload } from '@/partials/crud';

interface IGeneralSettingsProps {
  title: string;
  user: UserModel | null;
}

const createUserSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  name: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Name is required'),
  phone: Yup.string().matches(PHONE_REG_EXP, 'Phone number is not valid'),
  position: Yup.string().min(3, 'Minimum 3 symbols').max(50, 'Maximum 50 symbols')
});

interface IUserFormValues {
  id: number;
  email: string;
  name: string;
  phone: string;
  location: string;
  position: string;
  avatar: string | IImageInputFile | null;
}
export const MemberUpdatePageContentUserForm: FC<IGeneralSettingsProps> = ({ title, user }) => {
  const [loading, setLoading] = useState(false);

  const initialValues: IUserFormValues = {
    id: user?.id || 0,
    email: user?.email || '',
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    position: user?.position || '',
    avatar: user?.avatar ? user?.avatar : null
  };

  const formik = useFormik({
    initialValues,
    validationSchema: createUserSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setStatus(null);
      try {
        const payload = {
          ...values,
          avatar: typeof values.avatar === 'string' ? null : values.avatar?.file || null
        };
        await postUpdateUser(payload);
        setStatus('User created successfully!');
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        setStatus(error.response?.data?.message || 'Failed to create user');
      }

      setLoading(false);
      setSubmitting(false);
    }
  });

  return (
    <form className="card pb-2.5" onSubmit={formik.handleSubmit} noValidate>
      <div className="card-header" id="general_settings">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-body grid gap-5">
        <div className="flex items-center flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Photo</label>
          <div className="flex items-center justify-between flex-wrap grow gap-2.5">
            <span className="text-2sm font-medium text-gray-600">150x150px JPEG, PNG Image</span>
            <CrudAvatarUpload
              avatarUser={formik.values.avatar}
              onChange={(newAvatar) => formik.setFieldValue('avatar', newAvatar)}
            />
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Name</label>
          <div className="flex columns-1 w-full flex-wrap">
            <input
              className="input w-full"
              type="text"
              placeholder="Name"
              {...formik.getFieldProps('name')}
            />
            {formik.touched.name && formik.errors.name && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Email</label>
          <div className="flex columns-1 w-full flex-wrap">
            <input
              className="input w-full"
              type="email"
              placeholder="Email"
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.email}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Phone number</label>
          <div className="flex columns-1 w-full flex-wrap">
            <input
              className="input w-full"
              type="tel"
              placeholder="Phone number"
              {...formik.getFieldProps('phone')}
            />
            {formik.touched.phone && formik.errors.phone && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.phone}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Position</label>
          <div className="flex columns-1 w-full flex-wrap">
            <input
              className="input w-full"
              type="text"
              placeholder="Position"
              {...formik.getFieldProps('position')}
            />
            {formik.touched.position && formik.errors.position && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.position}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Location</label>
          <div className="flex columns-1 w-full flex-wrap">
            <input
              className="input w-full"
              type="text"
              placeholder="Location"
              {...formik.getFieldProps('location')}
            />
            {formik.touched.location && formik.errors.location && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.location}
              </span>
            )}
          </div>
        </div>

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
  );
};

export { type IGeneralSettingsProps };
