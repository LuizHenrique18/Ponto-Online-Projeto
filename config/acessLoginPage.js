module.exports = function acessLoginPage(req, res, next){
    let userConectado = req.session.userid
    console.log('Aqui Baby')
    if(userConectado){
        res.redirect('/ponto')
        return
    }
    next()
}