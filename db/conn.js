const Sequelize = require('sequelize')

const sequelize = new Sequelize('railway', 'root', 'bV2Mde5CjWHt5zzHPmjM',{
    host:'containers-us-west-181.railway.app',
    dialect:'mysql',
    port:8003
})

try{
    sequelize.authenticate()
    console.log('Banco conectado')
}catch{
    console.log(err)
}

module.exports = sequelize