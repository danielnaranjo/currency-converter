import Model from './Model';
import View from './View';
import SidebarController from './SidebarController';
import * as util from './util';

export default class Controller {

  view = null;
  model = null;

  constructor() {
    this.view = new View();
    this.model = new Model();
  }

  refreshData = async () => {
    // fetch data
    const { view, model } = this;
    const fetchStart = new Event('fetch-start');
    const fetchEnd = new Event('fetch-end');
    view.spinner.dispatchEvent(fetchStart);
    try {
      await model.fetchAndParseData();
      view.spinner.dispatchEvent(fetchEnd);
    } catch (err) {
      view.spinner.dispatchEvent(fetchEnd);
      model.setConnection(false);
      if ('localStorage' in window) {
        let { rates } = window.localStorage;
        try {
          rates = JSON.parse(rates);
          if (Array.isArray(rates) && rates.length > 0) {
            model.setCurrencies(rates);
          } else {
            model.setCurrencies(util.staticRates);
          }
        } catch (error) {
          model.setCurrencies(util.staticRates);
        }
      } else {
        model.setCurrencies(util.staticRates);
      }
    }
    model.transformCurrencies();
  }

  update = () => {
    const { view, model } = this;
    // I/O
    view.inputDisplay.textContent = model.input;
    view.outputDisplay.textContent = model.output;
    // Currency labels
    view.baseCurrencyDisplay.textContent = model.baseCurrency;
    view.targetCurrencyDisplay.textContent = model.targetCurrency;
    // State in sidebar
    view.baseCurrencySidebar.textContent = model.baseCurrency;
    view.targetCurrencySidebar.textContent = model.targetCurrency;
    // Modals
    view.countryModalTitle.textContent = model.modalTitle;
    view.bankModalTitle.textContent = model.modalTitle;
    model.fee.digits.forEach((digit, index) => {
      view.bankFeeDigit[index].textContent = digit;
    });
    // Country list
    for (const li of view.countryList.children) {
      let currentSymbol = '';
      for (const el of li.children) {
        if (util.hasClass(el, 'currency')) {
          currentSymbol = el.textContent;
        }
        if (el.tagName.toLowerCase() === 'i') {
          if (model.modalComparator === currentSymbol) {
            util.removeClass(el, 'cloak');
          } else {
            util.addClass(el, 'cloak');
          }
        }
      }
    }
    // localStorage
    if ('localStorage' in window) {
      const { localStorage } = window;
      localStorage.currencies = JSON.stringify(model.currencies);
      localStorage.baseCurrency = model.baseCurrency;
      localStorage.targetCurrency = model.targetCurrency;
      localStorage.fee = JSON.stringify(model.fee);
    }
  }

  appendInput = (input) => {
    const { model } = this;
    if (!model.inputMode) this.cancel();
    if (model.loading) return;
    model.appendInput(input);
  }

  cancel = () => {
    const { view, model } = this;
    model.clearOutput();
    model.clearInput();
    model.switchToInputMode();
    view.display.style.justifyContent = 'flex-end';
    util.addClass(view.outputDisplay, 'hidden');
    util.addClass(view.exchangeSign, 'hidden');
    util.addClass(view.targetCurrencyDisplay, 'hidden');
  }

  eval = () => {
    const { view, model } = this;
    if (model.loading) return;
    if (Number(model.input) !== 0) {
      model.eval();
      model.switchOffInputMode();
      view.display.style.justifyContent = 'safe center';
      util.removeClass(view.outputDisplay, 'hidden');
      util.removeClass(view.exchangeSign, 'hidden');
      util.removeClass(view.targetCurrencyDisplay, 'hidden');
    }
  }

  showModal = (options) => {
    const { model, view } = this;
    switch (options.type) {
      case 'currency-source': {
        model.modalComparator = model.baseCurrency;
        model.modalTitle = 'Choose source currency';
        util.removeClass(view.countryModal, 'hidden');
        this.update();
        break;
      }
      case 'currency-target': {
        model.modalComparator = model.targetCurrency;
        model.modalTitle = 'Choose target currency';
        util.removeClass(view.countryModal, 'hidden');
        this.update();
        break;
      }
      case 'bank-fee': {
        model.modalTitle = 'Set bank fee';
        util.removeClass(view.bankModal, 'hidden');
        this.update();
        break;
      }
      default: return; // eslint-disable-line
    }
  }

  init = async () => {
    const { view, model } = this;
    const SidebarCtrl = new SidebarController(view, model);
    // Set listeners
    // Nav and display
    view.spinner.addEventListener('fetch-start', () => {
      util.addClass(view.spinner, 'fa-spin');
    });
    view.spinner.addEventListener('fetch-end', () => {
      util.removeClass(view.spinner, 'fa-spin');
    });
    view.spinner.addEventListener('click', (e) => {
      this.refreshData();
      this.update();
      e.preventDefault();
    });
    view.exchangeSign.addEventListener('click', (e) => {
      model.switchTarget();
      this.eval();
      this.update();
      e.preventDefault();
    });
    // Sidebar
    view.changeSourceBtn.addEventListener('click', (e) => {
      this.showModal({ type: 'currency-source' });
      SidebarCtrl.closeSidebar();
      e.preventDefault();
    });
    view.changeTargetBtn.addEventListener('click', (e) => {
      this.showModal({ type: 'currency-target' });
      SidebarCtrl.closeSidebar();
      e.preventDefault();
    });
    view.changeBankFeeBtn.addEventListener('click', (e) => {
      this.showModal({ type: 'bank-fee' });
      SidebarCtrl.closeSidebar();
      e.preventDefault();
    });
    view.exchangeSignSidebar.addEventListener('click', (e) => {
      model.switchTarget();
      this.cancel();
      this.update();
      e.preventDefault();
    });
    view.menuButton.addEventListener('click', SidebarCtrl.toggleSidebar);
    view.sidebarClose.addEventListener('click', SidebarCtrl.toggleSidebar);
    // Country Modal
    view.countryModalClose.addEventListener('click', (e) => {
      util.addClass(view.countryModal, 'hidden');
      e.preventDefault();
    });
    // Bank modal
    view.bankModalClose.addEventListener('click', (e) => {
      this.cancel();
      util.addClass(view.bankModal, 'hidden');
      this.update();
      e.preventDefault();
    });
    view.bankIncrementFirstBtn.addEventListener('click', (e) => {
      model.incrementFeeDigit(1);
      this.update();
      e.preventDefault();
    });
    view.bankIncrementSecondBtn.addEventListener('click', (e) => {
      model.incrementFeeDigit(2);
      this.update();
      e.preventDefault();
    });
    view.bankIncrementThirdBtn.addEventListener('click', (e) => {
      model.incrementFeeDigit(3);
      this.update();
      e.preventDefault();
    });
    view.bankDecrementFirstBtn.addEventListener('click', (e) => {
      model.decrementFeeDigit(1);
      this.update();
      e.preventDefault();
    });
    view.bankDecrementSecondBtn.addEventListener('click', (e) => {
      model.decrementFeeDigit(2);
      this.update();
      e.preventDefault();
    });
    view.bankDecrementThirdBtn.addEventListener('click', (e) => {
      model.decrementFeeDigit(3);
      this.update();
      e.preventDefault();
    });
    // Keyboard
    for (const button of view.keyboard) {
      button.addEventListener('click', () => {
        // remove whitespaces
        const content = button.textContent.toString().replace(/\s/g, '');
        const num = Number(content);

        if (Number.isNaN(num)) {
          if (content === 'C') {
            this.cancel();
            this.update();
          }
          if (content === '=') {
            this.eval();
            this.update();
          }
        } else {
          this.appendInput(num);
          this.update();
        }
      });
    }
    // Currency list initialization
    util.currencies.sort((a, b) => {
      if (a.symbol < b.symbol) return -1;
      if (a.symbol > b.symbol) return 1;
      return 0;
    }).forEach((currency) => {
      const item = document.createElement('li');
      const flag = document.createElement('span');
      const symbol = document.createElement('span');
      const name = document.createElement('span');
      const checkmark = document.createElement('i');

      util.addClass(flag, 'flag-icon');
      util.addClass(flag, `flag-icon-${currency.code}`);
      util.addClass(symbol, 'currency');
      util.addClass(name, 'name');
      util.addClass(checkmark, 'fas');
      util.addClass(checkmark, 'fa-check');
      util.addClass(checkmark, 'cloak');

      symbol.textContent = currency.symbol;
      name.textContent = currency.name;

      item.appendChild(flag);
      item.appendChild(symbol);
      item.appendChild(name);
      item.appendChild(checkmark);
      view.countryList.appendChild(item);
      item.addEventListener('click', () => {
        if (model.modalComparator === model.baseCurrency) {
          model.setBaseCurrency(currency.symbol);
          model.modalComparator = currency.symbol;
          model.transformCurrencies();
        }
        if (model.modalComparator === model.targetCurrency) {
          model.setTargetCurrency(currency.symbol);
          model.modalComparator = currency.symbol;
          model.transformCurrencies();
        }
        this.update();
      });
    });

    // State initialization
    if ('localStorage' in window) {
      const { localStorage } = window;
      const { baseCurrency, targetCurrency, fee } = localStorage;
      model.setBaseCurrency(baseCurrency || 'EUR');
      model.setTargetCurrency(targetCurrency || 'GBP');
      if (fee.length > 0) {
        try {
          model.fee = JSON.parse(fee);
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      model.setBaseCurrency('EUR');
      model.setTargetCurrency('GBP');
    }

    // Fetch data
    await this.refreshData();
    this.update();

    // add missing flags cdns
    util.currencies.forEach((currency) => {
      util.addLink(`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/${currency.code}.svg`);
    });
  };

}
