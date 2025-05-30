import React, { createContext, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IOrderFormValues } from '@/api/post/postOrder/types.ts';

interface OrderCreationContextType {
  senderId: number | null;
  receiverId: number | null;
  mainFormData: IOrderFormValues | null;
  applicationId?: number | null;
  setSenderId: (id: number) => void;
  setReceiverId: (id: number) => void;
  setApplicationId: (id?: number) => void;
  setMainFormData: (data: IOrderFormValues) => void;
  clearAll: () => void;
}

const OrderCreationContext = createContext<OrderCreationContextType>({
  senderId: null,
  receiverId: null,
  applicationId: null,
  mainFormData: null,
  setSenderId: () => {},
  setReceiverId: () => {},
  setApplicationId: () => {},
  setMainFormData: () => {},
  clearAll: () => {}
});

export const OrderCreationProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mainFormData, setMainFormDataState] = useState<IOrderFormValues | null>(null);

  const [senderId, setSenderIdState] = useState<number | null>(
    searchParams.get('sender_id') ? Number(searchParams.get('sender_id')) : null
  );
  const [receiverId, setReceiverIdState] = useState<number | null>(
    searchParams.get('receiver_id') ? Number(searchParams.get('receiver_id')) : null
  );
  const [applicationId, setApplicationIdState] = useState<number | null>(
    searchParams.get('application_id') ? Number(searchParams.get('application_id')) : null
  );

  const setSenderId = (id: number) => {
    setSenderIdState(id);
    searchParams.set('sender_id', id.toString());
    setSearchParams(searchParams);
  };

  const setReceiverId = (id: number) => {
    setReceiverIdState(id);
    searchParams.set('receiver_id', id.toString());
    setSearchParams(searchParams);
  };

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
    setSenderIdState(null);
    setReceiverIdState(null);
    setApplicationIdState(null);
    ['sender_id', 'receiver_id', 'application_id'].forEach((param) => {
      searchParams.delete(param);
    });
    setSearchParams(searchParams);
  };

  return (
    <OrderCreationContext.Provider
      value={{
        senderId,
        receiverId,
        applicationId,
        mainFormData,
        setMainFormData,
        setSenderId,
        setReceiverId,
        setApplicationId,
        clearAll
      }}
    >
      {children}
    </OrderCreationContext.Provider>
  );
};

export const useOrderCreation = () => useContext(OrderCreationContext);
