const express = require('express')
const app     = express()
const exphbs  = require('express-handlebars')
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session')


// Rotas
const authRoutes = require('./routes/authRoutes')
const pagRouter  = require('./routes/pagRouter')
const profileRouter = require('./routes/profileRouter')
const historicoRouter = require('./routes/historicoRouter')
const controleRoutes = require('./routes/controleRoutes')
const geraExcelRouter = require('./routes/geraExcelRoutes')
const suporteRouter = require('./routes/suporteRoutes')

// Banco de dados
const conn = require('./db/conn');

app.use(express.static('imgPontos'))
app.use(express.static('public'))
app.use(
    bodyParser.urlencoded({
        limit:'50mb',
        extended:true
    })
)
app.use(bodyParser.json({limit:'50mb'}))

app.use(
    cookieSession({
        name:'session',
        secret:'Senha para o segredo',
        secure:false,
        maxAge:60 * 30 * 30 * 1000,
        httpOnly:true,
    }),
)


app.use((req, res, next) => {

    console.log(req.session.userid, 'Aqui app use req.session.userid');
  
    if (req.session.userid) {
      res.locals.session = req.session;
    }
  
    next();
});

app.use(express.json())
app.use(bodyParser.json());

app.use(express.static('helpers'))
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')


// Router 
app.use('/', pagRouter)
app.use('/', profileRouter)
app.use('/', authRoutes)
app.use('/', historicoRouter)
app.use('/', controleRoutes)
app.use('/', geraExcelRouter) 
app.use('/', suporteRouter)

app.listen(process.env.PORT || 3000)

conn
    // .sync({force:true})
    .sync()
    .then(()=>{
        console.log('Banco conectado')
    })
    .catch((err)=>{
        console.log(err)
    })