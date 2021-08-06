export default function renderDate(rawDate,dateString, diff) {
    if(!dateString) dateString = 'hh:mm:ss - dd-momo-yyyy'
    if(diff) diff = Number(diff.replace('d' ,'')) * 86400000
    if(!diff) diff = 0

    const date = new Date(new Date(rawDate).getTime() + diff)
    var hh = date.getHours()
    var mm = date.getMinutes()
    var ss = date.getSeconds()
    var dd = date.getDate()
    var momo = date.getMonth() + 1
    var yyyy = date.getFullYear()

    hh.toString().length === 1  && (hh = '0' + hh)
    mm.toString().length === 1  && (mm = '0' + mm)
    ss.toString().length === 1  && (ss = '0' + ss)
    dd.toString().length === 1  && (dd = '0' + dd)
    momo.toString().length === 1  && (momo = '0' + momo)

    dateString = dateString.replace('hh' , hh)
    dateString = dateString.replace('mm' , mm)
    dateString = dateString.replace('ss' , ss)
    dateString = dateString.replace('dd' , dd)
    dateString = dateString.replace('momo' , momo)
    dateString = dateString.replace('yyyy' , yyyy)
    return dateString
}