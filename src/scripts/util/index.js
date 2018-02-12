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
