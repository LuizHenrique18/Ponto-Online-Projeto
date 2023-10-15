const Sequelize = require('sequelize')

const sequelize = new Sequelize('railway', 'root', 'BPwndQSvwwuc4m3pjYrV',{
    host:'containers-us-west-108.railway.app',
    dialect:'mysql',
    port:7880 
})

try{
    sequelize.authenticate()
    console.log('Banco conectado')
}catch{
    console.log(err)
}

module.exports = sequelize