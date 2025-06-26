import React, { FC } from 'react';
import { CircularProgress } from '@mui/material';

interface Props {
  simple?: boolean;
}

export const SharedLoading: FC<Props> = ({ simple }) => {
  return (
    <>
      {simple ? (
        <div className="flex items-center justify-center h-full p-3">
          <CircularProgress />
        </div>
      ) : (
        <div className="card flex justify-center items-center p-5">
          <CircularProgress />
        </div>
      )}
    </>
  );
};
