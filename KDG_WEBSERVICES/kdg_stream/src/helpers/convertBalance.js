const convertBalance = number => {
  if (isNaN(Number(number))) {
    return '0';
  }

  number = Math.floor(number);
  number = number + '';
  let length = number.length;

  if (length <= 3) {
    return number;
  } else if (length <= 6) {
    number = number.split('');
    number.splice(-3, 0, ',');
    number = number.join('');
  } else if (length <= 9) {
    number = number.split('');
    number.splice(-3, 0, ',');
    number.splice(-7, 0, ',');
    number = number.join('');
  }

  return number;
};

export default convertBalance;
