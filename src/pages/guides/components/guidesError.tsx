import React, { FC } from 'react';

interface IProps {
  error: Error | null;
}

const GuidesError: FC<IProps> = ({ error }) => {
  return (
    <div className="card flex justify-center items-center p-5 text-red-500">
      <span>Error loading data: {error instanceof Error ? error.message : 'Unknown error'}</span>
    </div>
  );
};

export default GuidesError;
