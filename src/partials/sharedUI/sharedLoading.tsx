import React from 'react';
import { CircularProgress } from '@mui/material';

export const SharedLoading = () => {
  return (
    <div className="card flex justify-center items-center p-5">
      <CircularProgress />
    </div>
  );
};
