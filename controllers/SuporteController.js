module.exports = class SuporteController{

    static suporteMain(req,res){ 
        res.render('suporte/suporteMain')
    }
    
    static novoUsuario(req,res){
        console.log('chegou aqui')
        res.render('suporte/novoUsuario')
    } 
    
    static reportarErro(req,res){
        res.render('suporte/reportarErro')
    }

    static contato(req,res){
        res.render('suporte/contato')
    }
}