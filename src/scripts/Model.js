import { precisionRound } from './util';

export default class Model {

  sidebarVisible = false;
  loading = true;
  network = true;

  input = '0';
  inputMode = true;
  output = '';

  baseCurrency = '';
  targetCurrency = '';
  currencies = [];

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

  switchToInputMode = () => {
    this.inputMode = true;
  }

  switchOffInputMode = () => {
    this.inputMode = false;
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
    const result = ((base * 10000) * (rate * 10000)) / 100000000;
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
    const finding = this.currencies.find(currency => currency.symbol === currencySymbol);
    if (!finding) throw new Error('Invalid currency symbol!');
    this.baseCurrency = currencySymbol;
  }

  setTargetCurrency = (currencySymbol = '') => {
    const finding = this.currencies.find(currency => currency.symbol === currencySymbol);
    if (!finding) throw new Error('Invalid currency symbol!');
    this.targetCurrency = currencySymbol;
  }

  fetchAndParseData = async () => {
    try {
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const targetUrl = 'https://devweb2017.cis.strath.ac.uk/~aes02112/ecbxml.php';
      const response = await fetch(`${proxyUrl}${targetUrl}`);
      if (!response.ok) {
        throw new Error(response);
      }

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
      // add euros as well
      this.currencies.push({
        symbol: 'EUR',
        rate: 1.0,
      });
      this.loading = false;
      return response;
    } catch (error) {
      this.loading = false;
      console.error(error);
      return false;
    }
  }

  setConnection = (connection = true) => {
    if (connection !== true && connection !== false) throw new Error('Invalid argument!');
    this.network = connection;
  }

  updateStorage = () => {
    if ('localStorage' in window) {
      window.localStorage.currencies = JSON.stringify(this.currencies);
    }
  }

}
