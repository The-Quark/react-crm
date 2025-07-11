import { useFormikContext } from 'formik';
import { SharedAutocomplete, SharedDecimalInput } from '@/partials/sharedUI';
import { useIntl } from 'react-intl';
import { IApplicationPostFormValues } from '@/api/post/postWorkflow/postApplication/types.ts';
import { FC, useCallback, useState } from 'react';
import { BoxType } from '@/api/get/getGuides/getBoxTypes/types.ts';

interface Props {
  boxTypesData?: BoxType[];
  boxTypesLoading: boolean;
}

export const ApplicationsBoxTypeBlock: FC<Props> = ({ boxTypesData, boxTypesLoading }) => {
  const { formatMessage } = useIntl();
  const formik = useFormikContext<IApplicationPostFormValues>();
  const [searchBoxTypeTerm, setSearchBoxTypeTerm] = useState('');

  const handleBoxTypeChange = useCallback(
    (boxTypeId: string | number) => {
      if (boxTypeId === '' || boxTypeId === '__clear__') {
        formik.setValues({
          ...formik.values,
          box_type_id: '',
          box_width: '',
          box_height: '',
          box_length: ''
        });
        return;
      }
      const id = typeof boxTypeId === 'number' ? boxTypeId.toString() : boxTypeId;
      const selectedBoxType = boxTypesData?.find((box) => box.id === Number(id));
      if (selectedBoxType) {
        formik.setValues({
          ...formik.values,
          box_type_id: id,
          box_width: selectedBoxType.width?.toString() ?? '',
          box_height: selectedBoxType.height?.toString() ?? '',
          box_length: selectedBoxType.length?.toString() ?? ''
        });
      } else {
        formik.setValues({
          ...formik.values,
          box_type_id: id,
          box_width: '',
          box_height: '',
          box_length: ''
        });
      }
    },
    [formik, boxTypesData]
  );
  return (
    <>
      <h3 className="card-title">{formatMessage({ id: 'SYSTEM.BOX_TYPE' })}</h3>
      <SharedAutocomplete
        label={formatMessage({ id: 'SYSTEM.BOX_TYPE' })}
        value={formik.values.box_type_id ?? ''}
        options={
          boxTypesData?.map((app) => ({
            id: app.id,
            name: String(app.name || app.id)
          })) ?? []
        }
        placeholder={formatMessage({ id: 'SYSTEM.SELECT_BOX_TYPE' })}
        searchPlaceholder={formatMessage({ id: 'SYSTEM.SEARCH_BOX_TYPE' })}
        onChange={handleBoxTypeChange}
        error={formik.errors.box_type_id as string}
        touched={formik.touched.box_type_id}
        searchTerm={searchBoxTypeTerm}
        onSearchTermChange={setSearchBoxTypeTerm}
        loading={boxTypesLoading}
      />
      <SharedDecimalInput
        name="box_width"
        label={formatMessage({ id: 'SYSTEM.WIDTH' }) + ' (cm)'}
        formik={formik}
        disabled={!!formik.values.box_type_id}
      />
      <SharedDecimalInput
        name="box_length"
        label={formatMessage({ id: 'SYSTEM.LENGTH' }) + ' (cm)'}
        formik={formik}
        disabled={!!formik.values.box_type_id}
      />
      <SharedDecimalInput
        name="box_height"
        label={formatMessage({ id: 'SYSTEM.HEIGHT' }) + ' (cm)'}
        formik={formik}
        disabled={!!formik.values.box_type_id}
      />
    </>
  );
};
