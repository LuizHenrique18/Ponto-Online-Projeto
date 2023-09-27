const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const User = require('../models/User')

const Horarios = db.define('horarios',{
    horaEntrada:{
        type:DataTypes.STRING
    }, 
    horaSaida:{
        type:DataTypes.STRING
    }, 
    tempoDeTrabalho:{
        type:DataTypes.STRING
    },
    descricao:{
        type:DataTypes.STRING
    },
    dataDeCriacao:{
        type:DataTypes.STRING
    }
})

User.hasMany(Horarios, {foreignKey: 'horariosId' })
Horarios.belongsTo(User, {foreignKey: 'horariosId'})


module.exports = Horarios