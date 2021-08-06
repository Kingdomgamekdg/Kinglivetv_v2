const ONE_SECOND = 1000
const ONE_MINUTE = ONE_SECOND * 60
const ONE_HOUR = ONE_MINUTE * 60
const ONE_DAY = ONE_HOUR * 24
const ONE_MONTH = ONE_DAY * 30
const ONE_YEAR = ONE_MONTH * 12

export default function convertDateAgo(created_date) {
  // const now = new Date().getTime()
  const x = new Date().getTime() - new Date(created_date).getTime()

  // AGO
  if (x >= 0 && x < ONE_MINUTE) {
    const y = Math.floor(x / ONE_SECOND)
    return `${y} ${y === 1 ? 'second' : 'seconds'} ago`
  }

  if (x >= ONE_MINUTE && x < ONE_HOUR) {
    const y = Math.floor(x / ONE_MINUTE)
    return `${y} ${y === 1 ? 'minute' : 'minutes'} ago`
  }

  if (x >= ONE_HOUR && x < ONE_DAY) {
    const y = Math.floor(x / ONE_HOUR)
    return `${y} ${y === 1 ? 'hour' : 'hours'} ago`
  }

  if (x >= ONE_DAY && x < ONE_MONTH) {
    const y = Math.floor(x / ONE_DAY)
    return `${y} ${y === 1 ? 'day' : 'days'} ago`
  }

  if (x >= ONE_MONTH && x < ONE_YEAR) {
    const y = Math.floor(x / ONE_MONTH)
    return `${y} ${y === 1 ? 'month' : 'months'} ago`
  }

  if (x >= ONE_YEAR) {
    const y = Math.floor(x / ONE_YEAR)
    return `${y} ${y === 1 ? 'year' : 'years'} ago`
  }
  // AGO

  // LATER
  if (x < 0 && x > -ONE_MINUTE) {
    const y = -Math.floor(x / ONE_SECOND)
    return `${y} ${y === 1 ? 'second' : 'seconds'} later`
  }

  if (x <= -ONE_MINUTE && x > -ONE_HOUR) {
    const y = -Math.floor(x / ONE_MINUTE)
    return `${y} ${y === 1 ? 'minute' : 'minutes'} later`
  }

  if (x <= -ONE_HOUR && x > -ONE_DAY) {
    const y = -Math.floor(x / ONE_HOUR)
    return `${y} ${y === 1 ? 'hour' : 'hours'} later`
  }

  if (x <= -ONE_DAY && x > -ONE_MONTH) {
    const y = -Math.floor(x / ONE_DAY)
    return `${y} ${y === 1 ? 'day' : 'days'} later`
  }

  if (x <= -ONE_MONTH && x > -ONE_YEAR) {
    const y = -Math.floor(x / ONE_MONTH)
    return `${y} ${y === 1 ? 'month' : 'months'} later`
  }

  if (x <= -ONE_YEAR) {
    const y = -Math.floor(x / ONE_YEAR)
    return `${y} ${y === 1 ? 'year' : 'years'} later`
  }
  // LATER
}
