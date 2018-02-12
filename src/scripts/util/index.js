// Based on: http://youmightnotneedjquery.com/

export const addClass = (element, className) => {
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.className += ` ${className}`; // eslint-disable-line
  }
};

export const removeClass = (element, className) => {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); // eslint-disable-line
  }
};

export const precisionRound = (number, precision = 2) => {
  if (!number) throw new Error('Missing number argument!');
  const factor = 10 ** precision;
  return Math.round(number * factor) / factor;
};

export const staticRates = [
  { symbol: 'USD', rate: 1.2273 },
  { symbol: 'JPY', rate: 133.59 },
  { symbol: 'BGN', rate: 1.9558 },
  { symbol: 'CZK', rate: 25.335 },
  { symbol: 'DKK', rate: 7.4437 },
  { symbol: 'GBP', rate: 0.8874 },
  { symbol: 'HUF', rate: 312.08 },
  { symbol: 'PLN', rate: 4.1903 },
  { symbol: 'RON', rate: 4.6563 },
  { symbol: 'SEK', rate: 9.9448 },
  { symbol: 'CHF', rate: 1.15 },
  { symbol: 'ISK', rate: 125.2 },
  { symbol: 'NOK', rate: 9.7983 },
  { symbol: 'HRK', rate: 7.4435 },
  { symbol: 'RUB', rate: 71.5055 },
  { symbol: 'TRY', rate: 4.697 },
  { symbol: 'AUD', rate: 1.5721 },
  { symbol: 'BRL', rate: 4.0244 },
  { symbol: 'CAD', rate: 1.5475 },
  { symbol: 'CNY', rate: 7.7362 },
  { symbol: 'HKD', rate: 9.5985 },
  { symbol: 'IDR', rate: 16763.69 },
  { symbol: 'ILS', rate: 4.3273 },
  { symbol: 'INR', rate: 79.0045 },
  { symbol: 'KRW', rate: 1336.19 },
  { symbol: 'MXN', rate: 23.0932 },
  { symbol: 'MYR', rate: 4.86 },
  { symbol: 'NZD', rate: 1.6952 },
  { symbol: 'PHP', rate: 63.324 },
  { symbol: 'SGD', rate: 1.6321 },
  { symbol: 'THB', rate: 39.028 },
  { symbol: 'ZAR', rate: 14.8761 },
  { symbol: 'EUR', rate: 1 },
];
