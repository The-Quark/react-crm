import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getGlobalParameters } from '@/api';
import { CircularProgress } from '@mui/material';
import { GlobalParameterUpdateForm } from '@/pages/global-parameters/global-parameter-update/components/blocks/globalParameterUpdateForm.tsx';
import { ParametersModel } from '@/api/getGlobalParameters/types.ts';

const GlobalParameterUpdateContent = () => {
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
      <GlobalParameterUpdateForm title="Update Parameters" parameter={parameter} />
    </div>
  );
};

export { GlobalParameterUpdateContent };
