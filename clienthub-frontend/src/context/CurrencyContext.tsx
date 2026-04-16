import React, { createContext, useContext, useState } from 'react';

type Currency = 'RUB' | 'USD' | 'EUR' | 'CNY';

interface CurrencyRates {
  USD: number;
  EUR: number;
  CNY: number;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  rates: CurrencyRates;
  convert: (amount: number, from?: Currency, to?: Currency) => number;
  format: (amount: number, from?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('RUB');
  const [rates] = useState<CurrencyRates>({
    USD: 90,
    EUR: 100,
    CNY: 12.5
  });

  const convert = (amount: number, from: Currency = 'RUB', to: Currency = currency): number => {
    // Handle null/undefined/NaN/string
    const numAmount = Number(amount);
    if (!isFinite(numAmount)) return 0;
    
    if (from === to) return numAmount;

    let rubAmount = numAmount;
    if (from !== 'RUB') {
      rubAmount = numAmount * rates[from];
    }

    if (to === 'RUB') return rubAmount;
    return rubAmount / rates[to];
  };

  const format = (amount: number, from: Currency = 'RUB'): string => {
    // Handle null/undefined/NaN/string
    const numAmount = Number(amount);
    if (!isFinite(numAmount)) {
      const symbols: Record<Currency, string> = {
        RUB: '₽',
        USD: '$',
        EUR: '€',
        CNY: '¥'
      };
      return `0.00 ${symbols[currency]}`;
    }

    const converted = convert(numAmount, from, currency);
    const symbols: Record<Currency, string> = {
      RUB: '₽',
      USD: '$',
      EUR: '€',
      CNY: '¥'
    };

    return `${converted.toFixed(2)} ${symbols[currency]}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};
