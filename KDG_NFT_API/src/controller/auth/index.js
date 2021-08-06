exports.isAuthenticated = async function(req, res, next) {
    if(req?.headers?.['x-authenticated-id-by-kdg']){
        req._id = req.headers['x-authenticated-id-by-kdg']
        next()
    }else{
        return res.send({status : 401})
    }
};

exports.isAuthenticatedOrNot = async function(req, res, next) {
    if(req?.headers?.['x-authenticated-id-by-kdg']){
        req._id = req.headers['x-authenticated-id-by-kdg']
        next()
    }else{
        next()
    }
};