export default function smoothscroll(track, startX, endX, startY, endY,duration){
    var lengthX = endX - startX
    var lengthY = endY - startY
    var startTime = new Date().getTime()

    var interval = setInterval(() => {
        var currentTime = new Date().getTime()
        var timeSpend = currentTime - startTime;
        var timeSpendPercent = timeSpend / duration

        if(timeSpendPercent >= 1){
            track.scroll(endX, endY)
            clearInterval(interval)
        }
        if(timeSpendPercent < 1){
            track.scroll(startX + lengthX * timeSpendPercent, startY + lengthY * timeSpendPercent)
        }
    }, 10);
}