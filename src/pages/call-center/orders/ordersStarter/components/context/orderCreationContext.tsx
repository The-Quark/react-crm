import React, { createContext, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types.ts';

interface IModalInfo {
  application_full_name?: string;
  delivery_type_name?: string;
  package_type_name?: string;
  sender_country_name?: string;
  sender_city_name?: string;
  receiver_country_name?: string;
  receiver_city_name?: string;
}

interface OrderCreationContextType {
  mainFormData: IOrderFormValues | null;
  modalInfo: IModalInfo | null;
  applicationId?: number | null;
  setApplicationId: (id?: number) => void;
  setMainFormData: (data: IOrderFormValues) => void;
  setModalInfoData: (data: IModalInfo) => void;
  clearAll: () => void;
}

const OrderCreationContext = createContext<OrderCreationContextType>({
  applicationId: null,
  mainFormData: null,
  modalInfo: null,
  setApplicationId: () => {},
  setMainFormData: () => {},
  setModalInfoData: () => {},
  clearAll: () => {}
});

export const OrderCreationProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mainFormData, setMainFormDataState] = useState<IOrderFormValues | null>(null);
  const [modalInfo, setModalInfo] = useState<IModalInfo | null>(null);

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
  const setModalInfoData = (data: IModalInfo) => {
    setModalInfo(data);
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
        modalInfo,
        setModalInfoData,
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
