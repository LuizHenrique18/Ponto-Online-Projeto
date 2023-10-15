const express = require('express')
const app     = express()
const exphbs  = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const bodyParser = require('body-parser');


// Rotas
const authRoutes = require('./routes/authRoutes')
const pagRouter  = require('./routes/pagRouter')
const profileRouter = require('./routes/profileRouter')
const historicoRouter = require('./routes/historicoRouter')
const controlerRouter = require('./routes/controleRoutes')
const geraExcelRouter = require('./routes/geraExcelRoutes')

// Banco de dados
const conn = require('./db/conn');

// Models
const User = require('./models/User')
const Horarios = require('./models/Horarios')
const { profileEnd } = require('console')

app.use(express.static('public'))
app.use(
    express.urlencoded({
        extended:true,
    })
)

app.use(
    session({
        name:'session',
        secret:'Senha para o segredo',
        resave:false,
        saveUninitialized:false,
        store: new FileStore({
            logFn: function () {},
            path: require('path').join(require('os').tmpdir(), 'sessions'),
          }),
        cookie:{
            secure:false,
            maxAge:360000,
            expires:new Date(Date.now()+36000000),
            httpOnly:true,
        },
    }),
)

// set session to res
app.use((req, res, next) => {
    // console.log(req.session)
    console.log(req.session.userid);
  
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
app.use('/', controlerRouter)
app.use('/', geraExcelRouter) 

conn
    // .sync({force:true})
    .sync()
    .then(()=>{
        console.log('Conectado aoaoaoao')
    })
    .catch((err)=>{
        console.log(err)
    })
app.listen(process.env.PORT || 3000)