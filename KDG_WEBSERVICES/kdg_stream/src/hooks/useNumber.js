import { useLanguage } from '../context/LanguageLayer';

export default function useNumber(number) {
  const [{ language, hooksNumber }] = useLanguage();

  if (isNaN(Number(number))) {
    return '0';
  }

  number = Math.floor(number);
  number = number + '';
  let length = number.length;

  if (length <= 3) {
    return number;
  } else if (length === 4) {
    number = number.slice(0, 1) + hooksNumber[language].K;
  } else if (length === 5) {
    number = number.slice(0, 2) + hooksNumber[language].K;
  } else if (length === 6) {
    number = number.slice(0, 3) + hooksNumber[language].K;
  } else if (length === 7) {
    if (number[1] === '0') {
      number = number.slice(0, 1) + hooksNumber[language].M;
    } else {
      number = number.slice(0, 2);
      number = number.split('');
      number.splice(-1, 0, ',');
      number = number.join('') + hooksNumber[language].M;
    }
  } else if (length === 8) {
    if (number[2] === '0') {
      number = number.slice(0, 2) + hooksNumber[language].M;
    } else {
      number = number.slice(0, 3);
      number = number.split('');
      number.splice(-1, 0, ',');
      number = number.join('') + hooksNumber[language].M;
    }
  } else if (length === 9) {
    if (number[3] === '0') {
      number = number.slice(0, 3) + hooksNumber[language].M;
    } else {
      number = number.slice(0, 4);
      number = number.split('');
      number.splice(-1, 0, ',');
      number = number.join('') + hooksNumber[language].M;
    }
  } else if (length === 10) {
    if (number[1] === '0') {
      number = number.slice(0, 1) + hooksNumber[language].B;
    } else {
      number = number.slice(0, 2);
      number = number.split('');
      number.splice(-1, 0, ',');
      number = number.join('') + hooksNumber[language].B;
    }
  } else if (length === 11) {
    if (number[2] === '0') {
      number = number.slice(0, 2) + hooksNumber[language].B;
    } else {
      number = number.slice(0, 3);
      number = number.split('');
      number.splice(-1, 0, ',');
      number = number.join('') + hooksNumber[language].B;
    }
  } else if (length === 12) {
    if (number[3] === '0') {
      number = number.slice(0, 3) + hooksNumber[language].B;
    } else {
      number = number.slice(0, 4);
      number = number.split('');
      number.splice(-1, 0, ',');
      number = number.join('') + hooksNumber[language].B;
    }
  } else {
    return number;
  }

  return number;
}
