const Sequelize = require('sequelize')

const sequelize = new Sequelize('suzano', 'root', '',{
    host:'localhost',
    dialect:'mysql'
})

try{
    sequelize.authenticate()
    console.log('Banco conectado')
}catch{
    console.log(err)
}

module.exports = sequelize