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
    model.updateStorage();
    this.update();
  }

  update = () => {
    const { view, model } = this;
    // I/O
    view.inputDisplay.textContent = model.input;
    view.outputDisplay.textContent = model.output;
    // Currency labels
    view.baseCurrencyDisplay.textContent = model.baseCurrency;
    view.targetCurrencyDisplay.textContent = model.targetCurrency;
  }

  appendInput = (input) => {
    const { view, model } = this;
    if (!model.inputMode) this.cancel();
    if (model.loading) return;
    model.appendInput(input);
    view.inputDisplay.textContent = model.input;
    this.update();
  }

  cancel = () => {
    const { view, model } = this;
    if (model.loading) return;
    model.clearInput();
    model.switchToInputMode();
    view.display.style.justifyContent = 'flex-end';
    view.inputDisplay.textContent = model.input;
    util.addClass(view.outputDisplay, 'hidden');
    util.addClass(view.exchangeSign, 'hidden');
    util.addClass(view.targetCurrencyDisplay, 'hidden');
    this.update();
  }

  eval = () => {
    const { view, model } = this;
    if (model.loading) return;
    if (Number(model.input) !== 0) {
      model.eval();
      model.switchOffInputMode();
      view.display.style.justifyContent = 'center';
      util.removeClass(view.outputDisplay, 'hidden');
      util.removeClass(view.exchangeSign, 'hidden');
      util.removeClass(view.targetCurrencyDisplay, 'hidden');
      this.update();
    }
  }

  switchTarget = () => {
    const { model } = this;
    model.setInput(model.output);
    const base = model.baseCurrency;
    const target = model.targetCurrency;
    model.setBaseCurrency(target);
    model.setTargetCurrency(base);
    model.transformCurrencies();
    model.updateStorage();
    this.eval();
  }

  init = async () => {
    const { view, model } = this;
    const SidebarCtrl = new SidebarController(view, model);
    // set listeners
    view.menuButton.addEventListener('click', SidebarCtrl.toggleSidebar);
    view.sidebarClose.addEventListener('click', SidebarCtrl.toggleSidebar);
    view.spinner.addEventListener('fetch-start', () => {
      util.addClass(view.spinner, 'fa-spin');
    });
    view.spinner.addEventListener('fetch-end', () => {
      util.removeClass(view.spinner, 'fa-spin');
    });
    view.spinner.addEventListener('click', () => {
      this.refreshData();
    });
    view.exchangeSign.addEventListener('click', () => {
      this.switchTarget();
    });
    for (const button of view.keyboard) {
      button.addEventListener('click', () => {
        const content = button.textContent.toString().replace(/\s/g, '');
        const num = Number(content);

        if (Number.isNaN(num)) {
          if (content === 'C') {
            this.cancel();
          }
          if (content === '=') {
            this.eval();
          }
        } else {
          this.appendInput(num);
        }
      });
    }

    // State initialization
    if ('localStorage' in window) {
      const { localStorage } = window;
      const { baseCurrency, targetCurrency } = localStorage;
      model.setBaseCurrency(baseCurrency || 'EUR');
      model.setTargetCurrency(targetCurrency || 'GBP');
    } else {
      model.setBaseCurrency('EUR');
      model.setTargetCurrency('GBP');
    }
    await this.refreshData();
  };

}
