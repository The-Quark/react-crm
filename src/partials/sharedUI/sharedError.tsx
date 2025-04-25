import React, { FC } from 'react';
import { Container } from '@/components';

interface IProps {
  error: Error | null;
}

export const SharedError: FC<IProps> = ({ error }) => {
  return (
    <Container>
      <div className="card flex justify-center items-center p-5 text-red-500">
        <span>Error loading data: {error instanceof Error ? error.message : 'Unknown error'}</span>
      </div>
    </Container>
  );
};
