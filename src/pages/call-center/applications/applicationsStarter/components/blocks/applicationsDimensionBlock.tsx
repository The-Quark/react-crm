import { useFormikContext } from 'formik';
import { SharedAutocomplete, SharedDecimalInput } from '@/partials/sharedUI';
import { useIntl } from 'react-intl';
import { IApplicationPostFormValues } from '@/api/post/postWorkflow/postApplication/types.ts';
import { FC, useCallback, useState, useEffect } from 'react';
import { BoxType } from '@/api/get/getGuides/getBoxTypes/types.ts';

interface Props {
  boxTypesData?: BoxType[];
  boxTypesLoading: boolean;
}

export const ApplicationsDimensionBlock: FC<Props> = ({ boxTypesData, boxTypesLoading }) => {
  const { formatMessage } = useIntl();
  const formik = useFormikContext<IApplicationPostFormValues>();
  const [searchBoxTypeTerm, setSearchBoxTypeTerm] = useState('');
  const [selectedBoxType, setSelectedBoxType] = useState<BoxType | null>(null);

  const handleBoxTypeChange = useCallback(
    (boxTypeId: string | number) => {
      if (boxTypeId === '' || boxTypeId === '__clear__') {
        formik.setValues({
          ...formik.values,
          box_type_id: '',
          width: '',
          height: '',
          length: ''
        });
        setSelectedBoxType(null);
        return;
      }

      const id = typeof boxTypeId === 'number' ? boxTypeId.toString() : boxTypeId;
      const foundBoxType = boxTypesData?.find((box) => box.id === Number(id));

      if (foundBoxType) {
        formik.setValues({
          ...formik.values,
          box_type_id: id,
          width: foundBoxType.width?.toString() ?? '',
          height: foundBoxType.height?.toString() ?? '',
          length: foundBoxType.length?.toString() ?? ''
        });
        setSelectedBoxType(foundBoxType);
      } else {
        formik.setValues({
          ...formik.values,
          box_type_id: id,
          width: '',
          height: '',
          length: ''
        });
        setSelectedBoxType(null);
      }
    },
    [formik, boxTypesData]
  );

  useEffect(() => {
    if (selectedBoxType && formik.values.box_type_id) {
      const isWidthChanged = formik.values.width !== selectedBoxType.width?.toString();
      const isHeightChanged = formik.values.height !== selectedBoxType.height?.toString();
      const isLengthChanged = formik.values.length !== selectedBoxType.length?.toString();

      if (isWidthChanged || isHeightChanged || isLengthChanged) {
        formik.setFieldValue('box_type_id', '');
        setSelectedBoxType(null);
      }
    }
  }, [formik.values.width, formik.values.height, formik.values.length, selectedBoxType, formik]);

  return (
    <>
      <h3 className="card-title">{formatMessage({ id: 'SYSTEM.SIZES' })}</h3>
      <SharedAutocomplete
        label={formatMessage({ id: 'SYSTEM.BOX_TYPE' })}
        value={formik.values.box_type_id ?? ''}
        options={
          boxTypesData?.map((app) => ({
            id: app.id,
            name: String(`${app.name} (${app.width}x${app.length}x${app.height} cm)`)
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
        name="width"
        label={formatMessage({ id: 'SYSTEM.WIDTH' }) + ' (cm)'}
        formik={formik}
      />
      <SharedDecimalInput
        name="length"
        label={formatMessage({ id: 'SYSTEM.LENGTH' }) + ' (cm)'}
        formik={formik}
      />
      <SharedDecimalInput
        name="height"
        label={formatMessage({ id: 'SYSTEM.HEIGHT' }) + ' (cm)'}
        formik={formik}
      />
      <SharedDecimalInput
        name="weight"
        label={formatMessage({ id: 'SYSTEM.WEIGHT' }) + ' (kg)'}
        formik={formik}
      />
    </>
  );
};
