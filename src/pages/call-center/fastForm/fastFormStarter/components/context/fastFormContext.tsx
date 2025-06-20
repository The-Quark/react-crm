import React, { createContext, useCallback, useContext, useState } from 'react';
import { IApplicationPostFormValues } from '@/api/post/postWorkflow/postApplication/types.ts';
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types';
import { ISenderOrderFormValues } from '@/api/post/postWorkflow/postOrderSender/types.ts';
import { IReceiverOrderFormValues } from '@/api/post/postWorkflow/postOrderReceiver/types.ts';

interface IModalInfo {
  application_full_name?: string;
  delivery_type_name?: string;
  package_type_name?: string;
  sender_country_name?: string;
  sender_city_name?: string;
  receiver_country_name?: string;
  receiver_city_name?: string;
}

interface IOrderWithRelationsFormValues extends IOrderFormValues {
  sender?: ISenderOrderFormValues;
  receiver?: IReceiverOrderFormValues;
}

export interface IFastFormContext {
  application?: IApplicationPostFormValues;
  order?: IOrderWithRelationsFormValues;
}

interface FastFormContextType {
  mainForm?: IFastFormContext;
  setMainForm: (form?: IFastFormContext) => void;
  modalInfo: IModalInfo | null;
  setModalInfoData: (data: IModalInfo) => void;
  clearAll: () => void;
}

const FastFormContext = createContext<FastFormContextType>({
  mainForm: undefined,
  modalInfo: null,
  setModalInfoData: () => {},
  setMainForm: () => {},
  clearAll: () => {}
});

export const FastFormCreatorProvider = ({ children }: { children: React.ReactNode }) => {
  const [mainForm, setMainFormData] = useState<IFastFormContext | undefined>();
  const [modalInfo, setModalInfo] = useState<IModalInfo | null>(null);

  const setMainForm = (form?: IFastFormContext) => {
    setMainFormData(form);
  };

  const setModalInfoData = useCallback((data: IModalInfo) => {
    setModalInfo(data);
  }, []);

  const clearAll = () => {
    setMainFormData(undefined);
    setModalInfo(null);
  };

  return (
    <FastFormContext.Provider
      value={{
        mainForm,
        modalInfo,
        setModalInfoData,
        setMainForm,
        clearAll
      }}
    >
      {children}
    </FastFormContext.Provider>
  );
};

export const useFastFormContext = () => useContext(FastFormContext);
