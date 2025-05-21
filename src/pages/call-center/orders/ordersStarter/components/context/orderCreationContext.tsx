import React, { createContext, useContext, useState, useEffect } from 'react';

interface OrderCreationContextType {
  senderId: number | null;
  receiverId: number | null;
  applicationId: number | null;
  setSenderId: (id: number) => void;
  setReceiverId: (id: number) => void;
  setApplicationId: (id: number) => void;
  clearAll: () => void;
}

const OrderCreationContext = createContext<OrderCreationContextType>({
  senderId: null,
  receiverId: null,
  applicationId: null,
  setSenderId: () => {},
  setReceiverId: () => {},
  setApplicationId: () => {},
  clearAll: () => {}
});

export const OrderCreationProvider = ({ children }: { children: React.ReactNode }) => {
  const [senderId, setSenderIdState] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('senderId');
      return stored ? parseInt(stored, 10) : null;
    }
    return null;
  });

  const [receiverId, setReceiverIdState] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('receiverId');
      return stored ? parseInt(stored, 10) : null;
    }
    return null;
  });

  const [applicationId, setApplicationIdState] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('applicationId');
      return stored ? parseInt(stored, 10) : null;
    }
    return null;
  });

  useEffect(() => {
    if (senderId !== null) localStorage.setItem('senderId', String(senderId));
    else localStorage.removeItem('senderId');
  }, [senderId]);

  useEffect(() => {
    if (receiverId !== null) localStorage.setItem('receiverId', String(receiverId));
    else localStorage.removeItem('receiverId');
  }, [receiverId]);

  useEffect(() => {
    if (applicationId !== null) localStorage.setItem('applicationId', String(applicationId));
    else localStorage.removeItem('applicationId');
  }, [applicationId]);

  const clearAll = () => {
    setSenderIdState(null);
    setReceiverIdState(null);
    setApplicationIdState(null);
    localStorage.removeItem('senderId');
    localStorage.removeItem('receiverId');
    localStorage.removeItem('applicationId');
    console.log('Cleared all order creation data');
  };

  return (
    <OrderCreationContext.Provider
      value={{
        senderId,
        receiverId,
        applicationId,
        setSenderId: setSenderIdState,
        setReceiverId: setReceiverIdState,
        setApplicationId: setApplicationIdState,
        clearAll
      }}
    >
      {children}
    </OrderCreationContext.Provider>
  );
};

export const useOrderCreation = () => useContext(OrderCreationContext);
