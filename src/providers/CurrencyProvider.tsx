import React, { createContext, useContext, useEffect, useState } from 'react';
import { CURRENCIES, LOCAL_STORAGE_CURRENCY_KEY } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { getCurrencies } from '@/api';
import { getAuth } from '@/auth';

export type CurrencySystem = {
  name: string;
  code: string;
  symbol: string;
};

interface CurrencyContextType {
  currency: CurrencySystem;
  setCurrency: (currency: CurrencySystem) => void;
  availableCurrencies: CurrencySystem[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencySystem>(CURRENCIES[0]);
  const [availableCurrencies, setAvailableCurrencies] = useState<CurrencySystem[]>([...CURRENCIES]);

  const { data, isError, isSuccess } = useQuery({
    queryKey: ['currencies'],
    queryFn: () => getCurrencies({ is_active: true }),
    enabled: !!getAuth()
  });

  useEffect(() => {
    const auth = getAuth();
    if (!auth) {
      setAvailableCurrencies([...CURRENCIES]);
      return;
    }
    if (isError) {
      setAvailableCurrencies([...CURRENCIES]);
      return;
    }
    if (isSuccess && data?.result) {
      const serverCurrencies: CurrencySystem[] = data.result.map((item) => ({
        code: item.code,
        symbol: item.symbol,
        name: item.name
      }));

      setAvailableCurrencies(serverCurrencies);
    }
  }, [data, isError, isSuccess]);

  useEffect(() => {
    // Инициализация валюты из localStorage
    const initializeCurrency = () => {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_CURRENCY_KEY);

        if (saved) {
          const parsed = JSON.parse(saved) as CurrencySystem;
          const found = availableCurrencies.find((item) => item.code === parsed.code);

          if (found) {
            setCurrency(found);
          } else {
            const defaultCurrency = availableCurrencies[0] || CURRENCIES[0];
            setCurrency(defaultCurrency);
            localStorage.setItem(LOCAL_STORAGE_CURRENCY_KEY, JSON.stringify(defaultCurrency));
          }
        } else {
          const defaultCurrency = availableCurrencies[0] || CURRENCIES[0];
          setCurrency(defaultCurrency);
          localStorage.setItem(LOCAL_STORAGE_CURRENCY_KEY, JSON.stringify(defaultCurrency));
        }
      } catch (e) {
        console.error('Failed to initialize currency', e);
        const defaultCurrency = availableCurrencies[0] || CURRENCIES[0];
        setCurrency(defaultCurrency);
        localStorage.setItem(LOCAL_STORAGE_CURRENCY_KEY, JSON.stringify(defaultCurrency));
      }
    };

    initializeCurrency();
  }, [availableCurrencies]);

  const handleSetCurrency = (newCurrency: CurrencySystem) => {
    setCurrency(newCurrency);
    localStorage.setItem(LOCAL_STORAGE_CURRENCY_KEY, JSON.stringify(newCurrency));
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency: handleSetCurrency, availableCurrencies }}
    >
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
