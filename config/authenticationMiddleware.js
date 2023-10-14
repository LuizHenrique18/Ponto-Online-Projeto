module.exports = function authenticationMiddleware(req, res, next){
        if(!req.session.userid){
            res.redirect('/') 
            return
        }
    next()
}

