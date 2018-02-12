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

  fetchData = async () => {
    const { view, model } = this;
    const fetchStart = new Event('fetch-start');
    const fetchEnd = new Event('fetch-end');
    view.spinner.dispatchEvent(fetchStart);
    await model.fetchAndParseData();
    view.spinner.dispatchEvent(fetchEnd);
  }

  appendInput = (input) => {
    const { view, model } = this;
    if (!model.inputMode) this.cancel();
    if (model.loading) return;
    model.appendInput(input);
    view.inputDisplay.textContent = model.input;
  }

  updateBaseCurrency = () => {
    const { view, model } = this;
    view.baseCurrencyDisplay.textContent = model.baseCurrency;
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
  }

  eval = () => {
    const { view, model } = this;
    if (model.loading) return;
    if (Number(model.input) !== 0) {
      model.eval();
      model.switchOffInputMode();
      view.display.style.justifyContent = 'center';
      view.outputDisplay.textContent = model.output;
      view.targetCurrencyDisplay.textContent = model.targetCurrency;
      util.removeClass(view.outputDisplay, 'hidden');
      util.removeClass(view.exchangeSign, 'hidden');
      util.removeClass(view.targetCurrencyDisplay, 'hidden');
    }
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
      this.fetchData();
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

    // fetch data
    try {
      await this.fetchData();
    } catch (err) {
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

    model.setBaseCurrency('EUR');
    model.setTargetCurrency('GBP');
    model.transformCurrencies();
    model.updateStorage();
  };

}
