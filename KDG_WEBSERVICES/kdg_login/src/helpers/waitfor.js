const waitFor = function(time){
    return new Promise((resovle, reject)=>{
        setTimeout(resovle, time)
    })
}

export default waitFor