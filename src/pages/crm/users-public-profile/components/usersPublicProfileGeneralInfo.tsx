import React from 'react';
import { useIntl } from 'react-intl';

interface IGeneralInfoItem {
  label: string;
  info: string | React.ReactNode;
  type?: number;
}

interface UsersPublicProfileGeneralInfoProps {
  data: {
    phone?: string;
    email?: string;
    status?: string;
    roles?: Array<{ name?: string }>;
    company?: { company_name?: string };
    department?: { name?: string };
    subdivision?: { name?: string };
    position?: { title?: string };
    gender?: string;
    location?: {
      name?: string;
      country?: { name?: string };
    };
  };
}

export const UsersPublicProfileGeneralInfo = ({ data }: UsersPublicProfileGeneralInfoProps) => {
  const { formatMessage } = useIntl();
  const items: IGeneralInfoItem[] = [
    { label: `${formatMessage({ id: 'SYSTEM.PHONE' })}:`, info: data.phone || 'N/A', type: 1 },
    { label: `${formatMessage({ id: 'SYSTEM.EMAIL' })}:`, info: data.email || 'N/A', type: 2 },
    {
      label: `${formatMessage({ id: 'SYSTEM.STATUS' })}:`,
      info: (
        <span className="badge badge-sm badge-success badge-outline">{data.status || 'N/A'}</span>
      )
    },
    {
      label: `${formatMessage({ id: 'SYSTEM.ROLE' })}:`,
      info: data.roles?.[0]?.name || 'N/A'
    },
    {
      label: `${formatMessage({ id: 'SYSTEM.COMPANY' })}:`,
      info: data.company?.company_name || 'N/A'
    },
    {
      label: `${formatMessage({ id: 'SYSTEM.DEPARTMENT' })}:`,
      info: data.department?.name || 'N/A'
    },
    {
      label: `${formatMessage({ id: 'SYSTEM.SUBDIVISION' })}:`,
      info: data.subdivision?.name || 'N/A'
    },
    {
      label: `${formatMessage({ id: 'SYSTEM.POSITION' })}:`,
      info: data.position?.title || 'N/A'
    },
    {
      label: `${formatMessage({ id: 'SYSTEM.GENDER' })}:`,
      info: data.gender || 'N/A'
    },
    {
      label: `${formatMessage({ id: 'SYSTEM.COUNTRY' })}:`,
      info: data.location?.country?.name || 'N/A'
    },
    {
      label: `${formatMessage({ id: 'SYSTEM.CITY' })}:`,
      info: data.location?.name || 'N/A'
    }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{formatMessage({ id: 'SYSTEM.GENERAL_INFO_TITLE' })}</h3>
      </div>

      <div className="card-body pt-3.5 pb-3.5">
        <table className="table-auto">
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="text-sm text-gray-600 pb-3 pe-4 lg:pe-8">{item.label}</td>
                <td className="text-sm text-gray-900 pb-3">
                  {typeof item.info === 'string' ? <span>{item.info}</span> : item.info}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
