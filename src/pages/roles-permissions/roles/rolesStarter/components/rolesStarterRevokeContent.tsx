import React, { FC } from 'react';
import { Permission } from '@/api/get/getACL/getPermissionsMap/types.ts';
import { useFormik } from 'formik';
import { putPermissionsDistribute } from '@/api';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useIntl } from 'react-intl';

interface Props {
  data?: Permission[];
  role?: string;
}

export const RolesStarterRevokeContent: FC<Props> = ({ data = [], role }) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const formik = useFormik({
    initialValues: {
      permissions: data.map((permission) => ({
        id: permission.id,
        name: permission.name,
        role_has: permission.role_has
      }))
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const permissionNames = values.permissions.filter((p) => p.role_has).map((p) => p.name);
        await putPermissionsDistribute({
          mode: 'revoke',
          permissions: permissionNames,
          role: role ? role : undefined
        });
        navigate('/roles-permissions/roles/list');
        queryClient.invalidateQueries({ queryKey: ['roles'] });
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
    <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
      <div className="flex w-full flex-col gap-5">
        <div className="">
          <div className="card-header gap-2">
            <h3 className="card-title">
              {formatMessage({ id: 'SYSTEM.PERMISSIONS' })} &nbsp;
              <span className="link">{role?.toUpperCase()}</span>
            </h3>
          </div>

          <div className="card-table scrollable-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-start text-gray-300 font-normal min-w-[300px]">
                    {formatMessage({ id: 'SYSTEM.PERMISSION' })}
                  </th>
                  <th className="min-w-24 text-gray-700 font-normal text-center">
                    {formatMessage({ id: 'SYSTEM.ENABLED' })}
                  </th>
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
                        checked={permission.role_has}
                        onChange={() => {
                          const newPermissions = [...formik.values.permissions];
                          newPermissions[index].role_has = !newPermissions[index].role_has;
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
              {formatMessage({ id: 'SYSTEM.RESTORE_DEFAULTS' })}
            </button>
            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
              {formik.isSubmitting
                ? formatMessage({ id: 'SYSTEM.LOADING' })
                : formatMessage({ id: 'SYSTEM.SAVE' })}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
