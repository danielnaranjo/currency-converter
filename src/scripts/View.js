export default class View {

  // Root components
  sidebar = document.getElementById('sidebar');
  app = document.getElementById('app');

  // Main app components
  // navbar
  menuButton = document.getElementById('menu-handle');
  spinner = document.getElementById('spinner');
  // display
  display = document.getElementsByClassName('display')[0];
  inputDisplay = document.getElementById('input-display');
  baseCurrencyDisplay = document.getElementById('base-currency');
  targetCurrencyDisplay = document.getElementById('target-currency');
  outputDisplay = document.getElementById('output-display');
  exchangeSign = document.getElementById('exchange-sign');
  // keyboard
  keyboard = document.getElementsByClassName('digit');
  // Sidebar items
  sidebarClose = document.getElementById('sidebar-close');
  baseCurrencySidebar = document.getElementById('base-currency-sidebar');
  targetCurrencySidebar = document.getElementById('target-currency-sidebar');
  exchangeSignSidebar = document.getElementById('exchange-sign-sidebar');
  changeSourceBtn = document.getElementById('change-source');
  changeTargetBtn = document.getElementById('change-target');
  changeBankFeeBtn = document.getElementById('change-bank-fee');
  // Country Modal - picker
  countryModal = document.getElementById('country-modal');
  countryList = document.getElementById('country-list');
  countryModalClose = document.getElementById('country-modal-close');
  countryModalTitle = document.getElementById('country-modal-title');
  // Bank fee modal
  bankModal = document.getElementById('bank-modal');
  bankModalClose = document.getElementById('bank-modal-close');
  bankModalTitle = document.getElementById('bank-modal-title');
  bankIncrementFirstBtn = document.getElementById('increment-first-btn');
  bankIncrementSecondBtn = document.getElementById('increment-second-btn');
  bankIncrementThirdBtn = document.getElementById('increment-third-btn');
  bankDecrementFirstBtn = document.getElementById('decrement-first-btn');
  bankDecrementSecondBtn = document.getElementById('decrement-second-btn');
  bankDecrementThirdBtn = document.getElementById('decrement-third-btn');
  bankFeeDigit = [
    document.getElementById('bank-fee-first-digit'),
    document.getElementById('bank-fee-second-digit'),
    document.getElementById('bank-fee-third-digit'),
  ];
}
