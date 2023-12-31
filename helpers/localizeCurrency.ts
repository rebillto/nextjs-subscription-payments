export default function localizeCurrency(
  amount: number | string,
  countryCode: string
): string {
  const currencies: {
    [key: string]: {
      symbol: string;
      decimalSeparator: string;
      decimalPlaces: number;
    };
  } = {
    ARS: { symbol: '$', decimalSeparator: ',', decimalPlaces: 0 },
    CLP: { symbol: '$', decimalSeparator: '.', decimalPlaces: 0 },
    USD: { symbol: '$', decimalSeparator: '.', decimalPlaces: 0 },
    COP: { symbol: '$', decimalSeparator: ',', decimalPlaces: 0 },
    MXN: { symbol: '$', decimalSeparator: '.', decimalPlaces: 0 },
    UYU: { symbol: '$', decimalSeparator: ',', decimalPlaces: 0 },
    PEN: { symbol: 'S/', decimalSeparator: '.', decimalPlaces: 0 },
    BRL: { symbol: 'R$', decimalSeparator: ',', decimalPlaces: 0 }
  };

  let numericAmount: number;

  if (typeof amount === 'number') {
    numericAmount = amount;
  } else if (typeof amount === 'string') {
    numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      return 'Invalid amount';
    }
  } else {
    return 'Invalid amount';
  }

  if (countryCode in currencies) {
    const currency = currencies[countryCode];
    const formattedAmount = `${currency.symbol}${numericAmount.toFixed(
      currency.decimalPlaces
    )}`;
    return formattedAmount;
  } else {
    return 'Invalid country code';
  }
}
