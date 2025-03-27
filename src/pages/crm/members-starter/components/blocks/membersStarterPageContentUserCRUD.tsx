import { CrudAvatarUpload } from '@/partials/crud';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { KeenIcon } from '@/components';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import * as Yup from 'yup';
import { useFormik } from 'formik';

interface IGeneralSettingsProps {
  title: string;
}

const createUserSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required')
});

const initialValues = {
  email: '',
  password: ''
};

export const MembersStarterPageContentUserCRUD = ({ title }: IGeneralSettingsProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date(1984, 0, 20));
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: createUserSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);

      try {
        // if (!login) {
        //   throw new Error('JWTProvider is required for this form.');
        // }
        // await login(values.email, values.password);
      } catch {
        setStatus('The login details are incorrect');
        setSubmitting(false);
      }
      setLoading(false);
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
            <CrudAvatarUpload />
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Name</label>
          <input
            className="input"
            type="text"
            value={nameInput}
            placeholder="Name"
            onChange={(e) => setNameInput(e.target.value)}
          />
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Birth Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="date"
                  className={cn(
                    'input data-[state=open]:border-primary',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <KeenIcon icon="calendar" className="-ms-0.5" />
                  {date ? format(date, 'LLL dd, y') : <span>Pick a date</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="single" // Single date selection
                  defaultMonth={date}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Phone number</label>
          <input type="text" className="input" placeholder="Phone number" />
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Email</label>
          <input
            className="input"
            type="text"
            value={emailInput}
            placeholder="Email"
            onChange={(e) => setEmailInput(e.target.value)}
          />
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Address</label>
          <input
            className="input"
            type="text"
            value={addressInput}
            placeholder="Address"
            onChange={(e) => setAddressInput(e.target.value)}
          />
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Country</label>

          <Select defaultValue="1">
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Spain</SelectItem>
              <SelectItem value="2">Option 2</SelectItem>
              <SelectItem value="3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">State</label>
          <input type="text" className="input" placeholder="State" />
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">City</label>
          <input
            className="input"
            type="text"
            placeholder="City"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
          />
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 mb-2.5">
          <label className="form-label max-w-56">Password</label>
          <input
            className="input"
            type="text"
            placeholder="Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button className="btn btn-primary" disabled={loading || formik.isSubmitting}>
            {loading ? 'Please wait...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
};

export { type IGeneralSettingsProps };
