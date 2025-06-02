import React, { FC } from 'react';
import { Container } from '@/components';

interface IProps {
  error: Error | null;
  dataNotFound?: boolean;
}

export const SharedError: FC<IProps> = ({ error, dataNotFound }) => {
  return (
    <Container>
      <div className="card flex justify-center items-center p-5 text-red-500">
        {dataNotFound ? (
          <span>Data is null or not found</span>
        ) : (
          <span>
            Error loading data: {error instanceof Error ? error.message : 'Unknown error'}
          </span>
        )}
      </div>
    </Container>
  );
};
