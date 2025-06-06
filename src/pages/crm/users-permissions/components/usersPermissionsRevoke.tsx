import React, { FC } from 'react';
import { Permission } from '@/api/get/getACL/getPermissionsMap/types.ts';
import { useFormik } from 'formik';
import { putPermissionsDistribute } from '@/api';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  data?: Permission[];
  userId?: number;
}

export const UsersPermissionsRevoke: FC<Props> = ({ data = [], userId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const formik = useFormik({
    initialValues: {
      permissions: data.map((permission) => ({
        id: permission.id,
        name: permission.name,
        user_has: permission.user_has
      }))
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const permissionNames = values.permissions.filter((p) => p.user_has).map((p) => p.name);
        await putPermissionsDistribute({
          mode: 'revoke',
          permissions: permissionNames,
          user: userId ? userId : undefined
        });
        navigate('/crm/users/list');
        queryClient.invalidateQueries({ queryKey: ['users'] });
      } catch (error) {
        console.error('Error updating permissions:', error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleRestoreDefaults = () => {
    formik.resetForm();
  };

  return (
    <form className="card-body grid gap-5" onSubmit={formik.handleSubmit} noValidate>
      <div className="flex w-full flex-col gap-5">
        <div className="card">
          <div className="card-table scrollable-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-start text-gray-300 font-normal min-w-[300px]">Permission</th>
                  <th className="min-w-24 text-gray-700 font-normal text-center">Enabled</th>
                </tr>
              </thead>
              <tbody className="text-gray-900 font-medium">
                {formik.values.permissions.map((permission, index) => (
                  <tr key={permission.id}>
                    <td className="!py-5.5">
                      {data.find((p) => p.id === permission.id)?.nice_name || permission.name}
                    </td>
                    <td className="!py-5.5 text-center">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        name={`permissions[${index}].role_has`}
                        checked={permission.user_has}
                        onChange={() => {
                          const newPermissions = [...formik.values.permissions];
                          newPermissions[index].user_has = !newPermissions[index].user_has;
                          formik.setFieldValue('permissions', newPermissions);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card-footer justify-end py-7.5 gap-2.5">
            <button
              type="button"
              className="btn btn-light btn-outline"
              onClick={handleRestoreDefaults}
              disabled={formik.isSubmitting}
            >
              Restore Defaults
            </button>
            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
