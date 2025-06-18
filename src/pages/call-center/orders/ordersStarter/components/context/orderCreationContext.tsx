import React, { createContext, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types.ts';

interface OrderCreationContextType {
  mainFormData: IOrderFormValues | null;
  applicationId?: number | null;
  setApplicationId: (id?: number) => void;
  setMainFormData: (data: IOrderFormValues) => void;
  clearAll: () => void;
}

const OrderCreationContext = createContext<OrderCreationContextType>({
  applicationId: null,
  mainFormData: null,
  setApplicationId: () => {},
  setMainFormData: () => {},
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
    ['application_id'].forEach((param) => {
      searchParams.delete(param);
    });
    setSearchParams(searchParams);
  };

  return (
    <OrderCreationContext.Provider
      value={{
        applicationId,
        mainFormData,
        setMainFormData,
        setApplicationId,
        clearAll
      }}
    >
      {children}
    </OrderCreationContext.Provider>
  );
};
export const useOrderCreation = () => useContext(OrderCreationContext);
