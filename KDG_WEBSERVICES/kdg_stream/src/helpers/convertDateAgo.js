import { useLanguage } from '../context/LanguageLayer';

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_MONTH = ONE_DAY * 30;
const ONE_YEAR = ONE_MONTH * 12;

// const another_time = 1617179475756;

export default function useConvertDateAgo(created_date) {
  const [{ language, convert_date_ago }] = useLanguage();

  const now = new Date().getTime();

  const _created_date = new Date(created_date).getTime();

  const x = now - _created_date;

  // AGO
  if (x >= 0 && x < ONE_MINUTE) {
    const y = Math.floor(x / ONE_SECOND);
    return `${y} ${
      y === 1 ? convert_date_ago[language].second : convert_date_ago[language].seconds
    } ${convert_date_ago[language].ago}`;
  }

  if (x >= ONE_MINUTE && x < ONE_HOUR) {
    const y = Math.floor(x / ONE_MINUTE);
    return `${y} ${
      y === 1 ? convert_date_ago[language].minute : convert_date_ago[language].minutes
    } ${convert_date_ago[language].ago}`;
  }

  if (x >= ONE_HOUR && x < ONE_DAY) {
    const y = Math.floor(x / ONE_HOUR);
    return `${y} ${y === 1 ? convert_date_ago[language].hour : convert_date_ago[language].hours} ${
      convert_date_ago[language].ago
    }`;
  }

  if (x >= ONE_DAY && x < ONE_MONTH) {
    const y = Math.floor(x / ONE_DAY);
    return `${y} ${y === 1 ? convert_date_ago[language].day : convert_date_ago[language].days} ${
      convert_date_ago[language].ago
    }`;
  }

  if (x >= ONE_MONTH && x < ONE_YEAR) {
    const y = Math.floor(x / ONE_MONTH);
    return `${y} ${
      y === 1 ? convert_date_ago[language].month : convert_date_ago[language].months
    } ${convert_date_ago[language].ago}`;
  }

  if (x >= ONE_YEAR) {
    const y = Math.floor(x / ONE_YEAR);
    return `${y} ${y === 1 ? convert_date_ago[language].year : convert_date_ago[language].years} ${
      convert_date_ago[language].ago
    }`;
  }
  // AGO

  // LATER
  if (x < 0 && x > -ONE_MINUTE) {
    const y = -Math.floor(x / ONE_SECOND);
    return `${y} ${
      y === 1 ? convert_date_ago[language].second : convert_date_ago[language].seconds
    } ${convert_date_ago[language].later}`;
  }

  if (x <= -ONE_MINUTE && x > -ONE_HOUR) {
    const y = -Math.floor(x / ONE_MINUTE);
    return `${y} ${
      y === 1 ? convert_date_ago[language].minute : convert_date_ago[language].minutes
    } ${convert_date_ago[language].later}`;
  }

  if (x <= -ONE_HOUR && x > -ONE_DAY) {
    const y = -Math.floor(x / ONE_HOUR);
    return `${y} ${y === 1 ? convert_date_ago[language].hour : convert_date_ago[language].hours} ${
      convert_date_ago[language].later
    }`;
  }

  if (x <= -ONE_DAY && x > -ONE_MONTH) {
    const y = -Math.floor(x / ONE_DAY);
    return `${y} ${y === 1 ? convert_date_ago[language].day : convert_date_ago[language].days} ${
      convert_date_ago[language].later
    }`;
  }

  if (x <= -ONE_MONTH && x > -ONE_YEAR) {
    const y = -Math.floor(x / ONE_MONTH);
    return `${y} ${
      y === 1 ? convert_date_ago[language].month : convert_date_ago[language].months
    } ${convert_date_ago[language].later}`;
  }

  if (x <= -ONE_YEAR) {
    const y = -Math.floor(x / ONE_YEAR);
    return `${y} ${y === 1 ? convert_date_ago[language].year : convert_date_ago[language].years} ${
      convert_date_ago[language].later
    }`;
  }
  // LATER
}
