import { precisionRound, staticRates } from './util';

export default class Model {

  sidebarVisible = false;
  network = true;

  input = '0';
  inputMode = true;
  output = '0';

  baseCurrency = '';
  targetCurrency = '';
  currencies = [];

  modalComparator = '';
  modalTitle = '';

  fee = {
    value: 0.00,
    digits: [0, 0, 0],
  }

  toggleSidebar = () => {
    this.sidebarVisible = !this.sidebarVisible;
    return this.sidebarVisible;
  };

  appendInput = (num = '') => {
    if (num.toString().length !== 1) throw new Error('Invalid param!');
    if (!this.inputMode) return;
    if (Number(this.input) === 0 && num === 0) return;
    if (Number(this.input) === 0) {
      this.input = `${num}`;
      return;
    }
    if (this.input.length > 10) {
      return;
    }
    this.input = `${this.input}${num}`;
  }

  clearInput = () => {
    this.input = '0';
  }

  setInput = (input = '') => {
    if (typeof input !== 'string') throw new Error('Invalid argument!');
    this.input = input;
  }

  setOutput = (output = '') => {
    if (typeof output !== 'string') throw new Error('Invalid argument!');
    this.output = output;
  }

  clearOutput = () => {
    this.output = '0';
  }

  switchToInputMode = () => {
    this.inputMode = true;
  }

  switchOffInputMode = () => {
    this.inputMode = false;
  }

  incrementFeeDigit = (digit) => {
    if (![1, 2, 3].some(num => digit === num)) {
      throw new Error('Invalid argument! Digit has to be one of: 1, 2, 3');
    }
    const { digits } = this.fee;
    if (digits[digit - 1] === 9) {
      digits[digit - 1] = 0;
    } else {
      digits[digit - 1] = digits[digit - 1] + 1;
    }
    this.fee.value = Number(`${digits[0]}.${digits[1]}${digits[2]}`);
    this.fee.digits = digits;
  }

  decrementFeeDigit = (digit) => {
    if (![1, 2, 3].some(num => digit === num)) {
      throw new Error('Invalid argument! Digit has to be one of: 1, 2, 3');
    }
    const { digits } = this.fee;
    if (digits[digit - 1] === 0) {
      digits[digit - 1] = 9;
    } else {
      digits[digit - 1] = digits[digit - 1] - 1;
    }
    this.fee.value = Number(`${digits[0]}.${digits[1]}${digits[2]}`);
    this.fee.digits = digits;
  }

  switchTarget = () => {
    this.setInput(this.output);
    const base = this.baseCurrency;
    const target = this.targetCurrency;
    this.setBaseCurrency(target);
    this.setTargetCurrency(base);
    this.transformCurrencies();
  }

  eval = () => {
    // First find currency
    let rate;
    let symbol;
    for (const currency of this.currencies) {
      if (currency.symbol === this.targetCurrency) {
        rate = currency.rate; // eslint-disable-line
        symbol = currency.symbol; // eslint-disable-line
        break;
      }
    }
    if (!rate) throw new Error('Could not find target currency');

    const base = Number(this.input);
    // Normal ratio + fee
    let result = ((base * 10000) * (rate * 10000)) / 100000000;
    // Fee multiplier
    const multiplier = (100 + this.fee.value) / 100;
    result = ((result * 10000) * (multiplier * 10000)) / 100000000;
    const precision = symbol === 'JPY' ? 0 : 2;
    this.input = precisionRound(base, precision).toFixed(precision);
    this.output = precisionRound(result, precision).toFixed(precision);
  }

  transformCurrencies = (baseCurrency = this.baseCurrency) => {
    // First find its value
    let rate;
    for (const currency of this.currencies) {
      if (currency.symbol === baseCurrency) {
        rate = currency.rate; // eslint-disable-line
        break;
      }
    }
    if (!rate) throw new Error('Invalid currency param!');
    // Next update all rates
    const newCurrencies = this.currencies.map((currency) => {
      if (currency.symbol === baseCurrency) {
        return {
          ...currency,
          rate: 1,
        };
      }
      const val = (currency.rate * 10000) / (rate * 10000);
      return {
        ...currency,
        rate: val,
      };
    });
    this.setCurrencies(newCurrencies);
  };

  setCurrencies = (currencies = []) => {
    if (!Array.isArray(currencies) || currencies.length === 0) throw new Error('Invalid argument!');
    this.currencies = currencies;
  }

  setBaseCurrency = (currencySymbol = '') => {
    const finding = staticRates.find(currency => currency.symbol === currencySymbol);
    if (!finding) throw new Error('Invalid currency symbol!');
    this.baseCurrency = currencySymbol;
  }

  setTargetCurrency = (currencySymbol = '') => {
    const finding = staticRates.find(currency => currency.symbol === currencySymbol);
    if (!finding) throw new Error('Invalid currency symbol!');
    this.targetCurrency = currencySymbol;
  }

  fetchAndParseData = async () => {
    const targetUrl = 'https://cors-anywhere.herokuapp.com/https://devweb2017.cis.strath.ac.uk/~aes02112/ecbxml.php';
    const response = await fetch(targetUrl, {
      mode: 'cors',
      cache: 'no-cache',
      redirect: 'follow',
    });
    if (!response.ok) {
      console.warn('Response failed!', response);
      throw new Error(response);
    }
    console.log('Rates fetch success!');
    // Parse response
    const data = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'application/xml');
    const nodes = xml.getElementsByTagName('Cube');
    for (const node of nodes) {
      const symbol = node.getAttribute('currency');
      const rate = Number.parseFloat(node.getAttribute('rate'));
      if (symbol && rate) {
        this.currencies.push({ symbol, rate });
      }
    }
    console.log('Parse success', this.currencies);
    // add euros as well
    this.currencies.unshift({
      symbol: 'EUR',
      rate: 1.0,
    });
  }

  setConnection = (connection = true) => {
    if (connection !== true && connection !== false) throw new Error('Invalid argument!');
    this.network = connection;
  }

}
