const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const User = db.define('User',{
    name:{
        type:DataTypes.STRING,
        required:true,
    },
    email:{
        type:DataTypes.STRING,
        required:true,
    },
    cpf:{
        type:DataTypes.STRING,
        required:true,
    },
    password:{
        type:DataTypes.STRING,
        required:true,
    },
    nivel:{
        type:DataTypes.INTEGER,
        required:true
    }
})

module.exports = User