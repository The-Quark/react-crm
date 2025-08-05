import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types';
import { Order } from '@/api/get/getWorkflow/getOrder/types.ts';

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
  isLoading: boolean;
  setApplicationId: (id?: number) => void;
  setMainFormData: (data: IOrderFormValues) => void;
  setModalInfoData: (data: IModalInfo) => void;
  clearAll: () => void;
  updateFormField: <K extends keyof IOrderFormValues>(field: K, value: IOrderFormValues[K]) => void;
}

const OrderCreationContext = createContext<OrderCreationContextType>({
  applicationId: null,
  mainFormData: null,
  modalInfo: null,
  isLoading: false,
  setApplicationId: () => {},
  setMainFormData: () => {},
  setModalInfoData: () => {},
  clearAll: () => {},
  updateFormField: () => {}
});

interface OrderCreationProviderProps {
  children: React.ReactNode;
  initialData?: Order | null;
}

export const OrderCreationProvider = ({ children, initialData }: OrderCreationProviderProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [mainFormData, setMainFormDataState] = useState<IOrderFormValues | null>(null);
  const [modalInfo, setModalInfo] = useState<IModalInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationId, setApplicationIdState] = useState<number | null>(
    searchParams.get('application_id') ? Number(searchParams.get('application_id')) : null
  );

  useEffect(() => {
    const initializeData = () => {
      setIsLoading(true);
      if (initialData) {
        setApplicationIdState(initialData?.application_id ?? null);
        setMainFormDataState({
          id: initialData.id,
          application_id: initialData.application_id ?? '',
          status: initialData.status,
          delivery_type: initialData?.delivery_type?.id || '',
          delivery_category: initialData?.delivery_category || 'b2b',
          package_type: initialData?.package_type?.id || '',
          weight: initialData?.weight || '',
          width: initialData?.width || '',
          length: initialData?.length || '',
          height: initialData?.height || '',
          volume: initialData?.volume || '',
          nominal_cost: initialData?.nominal_cost || '',
          places_count: initialData?.places_count || 0,
          customs_clearance: initialData?.customs_clearance || false,
          is_international: initialData?.is_international || false,
          price: initialData?.price || '',
          package_description: initialData?.package_description || '',
          special_wishes: initialData?.special_wishes || '',
          order_content: initialData?.order_content || [],
          sender_contact_id: initialData.sender?.contact_id || '',
          sender_first_name: initialData.sender.first_name || '',
          sender_last_name: initialData.sender.last_name || '',
          sender_patronymic: initialData.sender.patronymic || '',
          sender_company_name: initialData.sender.company_name || '',
          sender_bin: initialData.sender.bin || '',
          sender_type:
            initialData.sender.sender_type || (initialData.sender.bin ? 'legal' : 'individual'),
          sender_country_id: initialData.sender.city?.country_id || '',
          sender_city_id: initialData.sender.city_id || '',
          sender_phone: initialData.sender.phone || '',
          sender_street: initialData.sender.street || '',
          sender_house: initialData.sender.house || '',
          sender_apartment: initialData.sender.apartment || '',
          sender_location_description: initialData.sender.location_description || '',
          sender_notes: initialData.sender.notes || '',
          receiver_first_name: initialData.receiver.first_name || '',
          receiver_last_name: initialData.receiver.last_name || '',
          receiver_patronymic: initialData.receiver.patronymic || '',
          receiver_company_name: initialData.receiver.company_name || '',
          receiver_bin: initialData.receiver.bin || '',
          receiver_type:
            initialData.receiver.receiver_type ||
            (initialData.receiver.bin ? 'legal' : 'individual'),
          receiver_country_id: initialData.receiver.city?.country_id || '',
          receiver_city_id: initialData.receiver.city_id || '',
          receiver_phone: initialData.receiver.phone || '',
          receiver_street: initialData.receiver.street || '',
          receiver_house: initialData.receiver.house || '',
          receiver_apartment: initialData.receiver.apartment || '',
          receiver_location_description: initialData.receiver.location_description || '',
          receiver_notes: initialData.receiver.notes || '',
          receiver_contact_id: initialData.receiver.contact_id || ''
        });

        if (initialData.application_id) {
          setSearchParams((prev) => {
            prev.set('application_id', initialData.application_id!.toString());
            return prev;
          });
        }
      }

      setIsLoading(false);
    };

    initializeData();
  }, [initialData, setSearchParams]);

  const setApplicationId = useCallback(
    (id?: number) => {
      setApplicationIdState(id ?? null);
      setSearchParams((prev) => {
        if (id !== undefined) {
          prev.set('application_id', id.toString());
        } else {
          prev.delete('application_id');
        }
        return prev;
      });
    },
    [setSearchParams]
  );

  const setModalInfoData = useCallback((data: IModalInfo) => {
    setModalInfo(data);
  }, []);

  const setMainFormData = useCallback((data: IOrderFormValues) => {
    setMainFormDataState(data);
  }, []);

  const updateFormField = useCallback(
    <K extends keyof IOrderFormValues>(field: K, value: IOrderFormValues[K]) => {
      setMainFormDataState((prev) => ({
        ...(prev || ({} as IOrderFormValues)),
        [field]: value
      }));
    },
    []
  );

  const clearAll = useCallback(() => {
    setApplicationIdState(null);
    setMainFormDataState(null);
    setModalInfo(null);
    setSearchParams((prev) => {
      ['application_id'].forEach((param) => prev.delete(param));
      return prev;
    });
  }, [setSearchParams]);

  const contextValue = useMemo(
    () => ({
      applicationId,
      mainFormData,
      modalInfo,
      isLoading,
      setModalInfoData,
      setMainFormData,
      setApplicationId,
      clearAll,
      updateFormField
    }),
    [
      applicationId,
      mainFormData,
      modalInfo,
      isLoading,
      setModalInfoData,
      setMainFormData,
      setApplicationId,
      clearAll,
      updateFormField
    ]
  );

  return (
    <OrderCreationContext.Provider value={contextValue}>{children}</OrderCreationContext.Provider>
  );
};

export const useOrderCreation = () => {
  const context = useContext(OrderCreationContext);
  if (!context) {
    throw new Error('useOrderCreation must be used within an OrderCreationProvider');
  }
  return context;
};
