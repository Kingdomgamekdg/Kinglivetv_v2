const convertTime = timeSecond => {
  let duration, second, minute, hour, temp, result;

  timeSecond = Number(timeSecond);
  if (isNaN(timeSecond)) timeSecond = 0;
  duration = Math.round(timeSecond);
  second = duration % 60;
  temp = (duration - second) / 60;
  if (temp > 59) {
    minute = temp % 60;
    hour = (temp - minute) / 60;
    minute = (minute + '').length === 1 ? '0' + minute : minute + '';
    hour = hour + '';
  } else {
    minute = temp + '';
  }
  second = (second + '').length === 1 ? '0' + second : second + '';

  if (hour) result = `${hour}:${minute}:${second}`;
  else result = `${minute}:${second}`;
  return result;
};

export default convertTime;
