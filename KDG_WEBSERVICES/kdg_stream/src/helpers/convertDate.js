export default function convertDate(date, format = '') {
  let _date = new Date(date);

  let _format = format || 'hh:mm:ss dd-MM-yyyy';

  let dd = _date.getDate();
  if ((dd + '').length === 1) {
    dd = '0' + dd;
  }

  let MM = _date.getMonth() + 1;
  if ((MM + '').length === 1) {
    MM = '0' + MM;
  }

  let yyyy = _date.getFullYear();

  let hh = _date.getHours();
  if ((hh + '').length === 1) {
    hh = '0' + hh;
  }

  let mm = _date.getMinutes();
  if ((mm + '').length === 1) {
    mm = '0' + mm;
  }

  let ss = _date.getSeconds();
  if ((ss + '').length === 1) {
    ss = '0' + ss;
  }

  _format = _format
    .replace('dd', dd)
    .replace('MM', MM)
    .replace('yyyy', yyyy)
    .replace('hh', hh)
    .replace('mm', mm)
    .replace('ss', ss);
  return _format;
}
