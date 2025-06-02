import React, { createContext, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IOrderFormValues } from '@/api/post/postOrder/types.ts';

interface FastFormContextType {
  applicationId?: number | null;
  setApplicationId: (id?: number) => void;
  clearAll: () => void;
}

const FastFormContext = createContext<FastFormContextType>({
  applicationId: null,
  setApplicationId: () => {},
  clearAll: () => {}
});

export const OrderCreationProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mainFormData, setMainFormDataState] = useState<IOrderFormValues | null>(null);

  const [applicationId, setApplicationIdState] = useState<number | null>(
    searchParams.get('application_id') ? Number(searchParams.get('application_id')) : null
  );

  const setApplicationId = (id?: number) => {
    setApplicationIdState(id ?? null);
    if (id !== undefined) {
      searchParams.set('application_id', id.toString());
    } else {
      searchParams.delete('application_id');
    }
    setSearchParams(searchParams);
  };

  const setMainFormData = (data: IOrderFormValues) => {
    setMainFormDataState(data);
    setSearchParams(searchParams);
  };

  const clearAll = () => {
    setApplicationIdState(null);
    ['sender_id', 'receiver_id', 'application_id'].forEach((param) => {
      searchParams.delete(param);
    });
    setSearchParams(searchParams);
  };

  return (
    <FastFormContext.Provider
      value={{
        applicationId,
        setApplicationId,
        clearAll
      }}
    >
      {children}
    </FastFormContext.Provider>
  );
};
export const useFastFormContext = () => useContext(FastFormContext);
