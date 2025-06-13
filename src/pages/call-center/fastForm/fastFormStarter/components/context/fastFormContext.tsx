import React, { createContext, useContext, useState } from 'react';
import { IApplicationPostFormValues } from '@/api/post/postWorkflow/postApplication/types.ts';
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types';
import { ISenderOrderFormValues } from '@/api/post/postWorkflow/postOrderSender/types.ts';
import { IReceiverOrderFormValues } from '@/api/post/postWorkflow/postOrderReceiver/types.ts';

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
  clearAll: () => void;
}

const FastFormContext = createContext<FastFormContextType>({
  mainForm: undefined,
  setMainForm: () => {},
  clearAll: () => {}
});

export const FastFormCreatorProvider = ({ children }: { children: React.ReactNode }) => {
  const [mainForm, setMainFormData] = useState<IFastFormContext | undefined>();

  const setMainForm = (form?: IFastFormContext) => {
    setMainFormData(form);
  };

  const clearAll = () => {
    setMainFormData(undefined);
  };

  return (
    <FastFormContext.Provider
      value={{
        mainForm,
        setMainForm,
        clearAll
      }}
    >
      {children}
    </FastFormContext.Provider>
  );
};

export const useFastFormContext = () => useContext(FastFormContext);
