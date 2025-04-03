import { FC, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import { UserModel } from '@/api/getMemberById/types.ts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toAbsoluteUrl } from '@/utils';
import { Link } from 'react-router-dom';

interface IGeneralSettingsProps {
  title: string;
  user: UserModel | null;
}

interface IUserFormValues {
  user: number;
  role: number | undefined;
}
const STORAGE_URL = import.meta.env.VITE_APP_STORAGE_AVATAR_URL;
const createUserSchema = Yup.object().shape({
  role: Yup.number().required('Name is required')
});
export const MemberRoleUpdatePageContentForm: FC<IGeneralSettingsProps> = ({ title, user }) => {
  const [loading, setLoading] = useState(false);

  const initialValues: IUserFormValues = {
    user: user?.id || 0,
    role: user?.roles?.[0]?.id || 0
  };

  const formik = useFormik({
    initialValues,
    validationSchema: createUserSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setStatus(null);
      try {
        // await postUpdateUser(...values);
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
          <label className="form-label max-w-56">Member</label>
          <div className="flex items-center  px-2 py-1.5 gap-3 w-full">
            <img
              className="size-9 rounded-full border-2 border-success"
              src={
                user ? `${STORAGE_URL}/${user.avatar}` : toAbsoluteUrl('/media/avatars/blank.png')
              }
              alt="avatar"
            />
            <div className="flex flex-col gap-1.5">
              <Link
                to="/account/home/user-profile"
                className="text-sm text-gray-800 hover:text-primary font-semibold leading-none"
              >
                {user ? user.name : 'Not Found'}
              </Link>
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-primary font-medium leading-none"
              >
                {user ? user.email : 'Not Found'}
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Role</label>
          <div className="flex columns-1 w-full flex-wrap">
            <Select {...formik.getFieldProps('role')}>
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Spain</SelectItem>
                <SelectItem value="2">Option 2</SelectItem>
                <SelectItem value="3">Option 3</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.role && formik.errors.role && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.role}
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
