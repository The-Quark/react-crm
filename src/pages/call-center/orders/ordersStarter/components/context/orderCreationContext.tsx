import React, { createContext, useContext, useState, useCallback } from 'react';

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
  const [state, setState] = useState({
    senderId: null as number | null,
    receiverId: null as number | null,
    applicationId: null as number | null
  });

  const setSenderId = useCallback((id: number) => {
    console.log('Setting senderId:', id);
    setState((prev) => ({ ...prev, senderId: id }));
  }, []);

  const clearAll = useCallback(() => {
    setState({ senderId: null, receiverId: null, applicationId: null });
  }, []);

  return (
    <OrderCreationContext.Provider
      value={{
        ...state,
        setSenderId,
        setReceiverId: (id: number) => setState((prev) => ({ ...prev, receiverId: id })),
        setApplicationId: (id: number) => setState((prev) => ({ ...prev, applicationId: id })),
        clearAll
      }}
    >
      {children}
    </OrderCreationContext.Provider>
  );
};

export const useOrderCreation = () => useContext(OrderCreationContext);
