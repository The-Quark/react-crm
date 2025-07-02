import React, { createContext, useContext, useEffect, useState } from 'react';
import { CURRENCIES, LOCAL_STORAGE_CURRENCY_KEY } from '@/utils';

type Currency = (typeof CURRENCIES)[number];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CURRENCY_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Currency;
        const found = CURRENCIES.find((item) => item.code === parsed.code);
        if (found) {
          setCurrency(found);
        }
      } catch (e) {
        console.error('Failed to parse currency from localStorage', e);
      }
    } else {
      localStorage.setItem(LOCAL_STORAGE_CURRENCY_KEY, JSON.stringify(CURRENCIES[0]));
    }
  }, []);

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem(LOCAL_STORAGE_CURRENCY_KEY, JSON.stringify(newCurrency));
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
