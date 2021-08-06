export default function isValidDate(dateString) {
  let regEx = /^\d{1,2}\/\d{1,2}\/\d{4}$/
  if (!dateString.match(regEx)) return false // Invalid format

  let [day, month, year] = dateString.split('/')
  if (day < 1 || day > 31) return false
  if (month < 1 || month > 12) return false
  let d = new Date(year, month - 1)
  let dNum = d.getTime()
  if (!dNum) return false // NaN value, Invalid date

  return true
}
