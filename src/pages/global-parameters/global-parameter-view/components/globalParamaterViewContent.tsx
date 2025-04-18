import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getGlobalParameters } from '@/api/get';
import { CircularProgress } from '@mui/material';
import { ParametersModel } from '@/api/get/getGlobalParameters/types.ts';
import { GlobalParameterViewContentCard } from '@/pages/global-parameters/global-parameter-view/components/blocks/globalParameterViewContentCard.tsx';

const GlobalParameterViewContent = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [parameter, setParameter] = useState<ParametersModel>();

  useEffect(() => {
    const fetchParameter = async () => {
      try {
        setLoading(true);
        const parameterData = await getGlobalParameters(Number(id));
        setParameter(parameterData.result[0]);
      } catch (err) {
        console.error('Request error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchParameter();
  }, [id]);

  if (loading) {
    return (
      <div className="card flex justify-center items-center p-5">
        <CircularProgress />
      </div>
    );
  }

  if (!parameter) {
    return (
      <div className="card flex justify-center items-center p-5 text-danger">
        Global Parameters not found or an error occurred while loading data.
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <GlobalParameterViewContentCard title="Global Parameters" parameter={parameter} />
    </div>
  );
};

export { GlobalParameterViewContent };
