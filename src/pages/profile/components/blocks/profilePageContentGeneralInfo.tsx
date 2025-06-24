import { useIntl } from 'react-intl';
import { useCurrentUser } from '@/api';

interface IGeneralInfoItem {
  label: string;
  info: string;
  type?: number;
}
interface IGeneralInfoItems extends Array<IGeneralInfoItem> {}

const ProfilePageContentGeneralInfo = () => {
  const { formatMessage } = useIntl();
  const { data: currentUser } = useCurrentUser();

  const items: IGeneralInfoItems = [
    {
      label: `${formatMessage({ id: 'SYSTEM.PHONE' })}:`,
      info: String(currentUser?.phone),
      type: 1
    },
    {
      label: `${formatMessage({ id: 'SYSTEM.EMAIL' })}:`,
      info: String(currentUser?.email),
      type: 2
    },
    {
      label: `${formatMessage({ id: 'SYSTEM.STATUS' })}:`,
      info: `<span class="badge badge-sm badge-success badge-outline">${String(currentUser?.status)}</span>`
    },
    {
      label: `${formatMessage({ id: 'SYSTEM.ROLE' })}:`,
      info: String(currentUser?.roles[0].name)
    },
    {
      label: `${formatMessage({ id: 'SYSTEM.COMPANY' })}:`,
      info: String(currentUser?.company?.company_name)
    },
    {
      label: `${formatMessage({ id: 'SYSTEM.DEPARTMENT' })}:`,
      info: String(currentUser?.department?.name)
    },
    {
      label: `${formatMessage({ id: 'SYSTEM.SUBDIVISION' })}:`,
      info: String(currentUser?.subdivision?.name)
    },
    {
      label: `${formatMessage({ id: 'SYSTEM.POSITION' })}:`,
      info: String(currentUser?.position?.title)
    },
    {
      label: `${formatMessage({ id: 'SYSTEM.GENDER' })}:`,
      info: String(currentUser?.gender)
    },
    {
      label: `${formatMessage({ id: 'SYSTEM.COUNTRY' })}:`,
      info: String(currentUser?.location?.country.name)
    },
    {
      label: `${formatMessage({ id: 'SYSTEM.CITY' })}:`,
      info: String(currentUser?.location?.name)
    }
  ];

  const renderItems = (item: IGeneralInfoItem, index: number) => {
    return (
      <tr key={index}>
        <td className="text-sm text-gray-600 pb-3 pe-4 lg:pe-8">{item.label}</td>
        <td className="text-sm text-gray-900 pb-3">
          {item.type === 1 ? (
            <span>{item.info}</span>
          ) : item.type === 2 ? (
            <span>{item.info}</span>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: item.info }}></span>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{formatMessage({ id: 'SYSTEM.GENERAL_INFO_TITLE' })}</h3>
      </div>

      <div className="card-body pt-3.5 pb-3.5">
        <table className="table-auto">
          <tbody>
            {items.map((item, index) => {
              return renderItems(item, index);
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { ProfilePageContentGeneralInfo, type IGeneralInfoItem, type IGeneralInfoItems };
