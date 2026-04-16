import { useCurrency } from '../hooks/useCurrency';

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  const currencies = [
    { code: 'RUB' as const, symbol: '₽', name: 'Рубль' },
    { code: 'USD' as const, symbol: '$', name: 'Доллар' },
    { code: 'EUR' as const, symbol: '€', name: 'Евро' },
    { code: 'CNY' as const, symbol: '¥', name: 'Юань' }
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="hidden md:inline text-sm text-gray-600">Валюта:</span>
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {currencies.map((curr) => (
          <button
            key={curr.code}
            onClick={() => setCurrency(curr.code)}
            className={`px-3 py-2.5 rounded text-sm font-medium transition-colors min-h-[44px] min-w-[44px] ${
              currency === curr.code
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title={curr.name}
            aria-label={`Выбрать валюту ${curr.name}`}
          >
            {curr.symbol}
          </button>
        ))}
      </div>
    </div>
  );
}
