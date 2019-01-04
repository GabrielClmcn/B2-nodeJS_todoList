const db = require('sqlite')
const express = require('express')
const bodyParser = require('body-parser')
const api = express()
const methodOverride = require("method-override")

db.open('api.db').then(() => {
  Promise.all([
    db.run("CREATE TABLE IF NOT EXISTS todos (name, completion, createdAt, updatedAt)"),
    db.run("CREATE TABLE IF NOT EXISTS users (firstname, lastname, username, password, email, createdAt, updatedAt)"),
  ]).then(() => {
    console.log('Database is ready')
  }).catch((err) => {
    console.log('Une erreur est survenue :', err)
  })
})

api.set('views', './views/todos')
api.set('view engine', 'hbs')

//REDIRECTION
// api.all('/', (req, res, next) => {
//   res.redirect(301, '/todos')
// })

// MIDDLEWARE POUR PARSER LE BODY
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({ extended: false }))
api.use(methodOverride('_method'))

// ROUTES
api.use('/todos', require('./controllers/todos'))

//REDIRECTION
api.all('/', (req, res, next) => {
  res.redirect(301, '/todos')
})


api.listen(8080);

console.log("http://localhost:8080/");