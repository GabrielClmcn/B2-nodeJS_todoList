const db = require('sqlite')
const express = require('express')
const bodyParser = require('body-parser')
const api = express()
const methodOverride = require("method-override")
const session = require('express-session')
const FileStore = require('session-file-store')(session);

db.open('api.db').then(() => {
  Promise.all([
    db.run("CREATE TABLE IF NOT EXISTS todos (userId, message, completion, createdAt, updatedAt)"),
    db.run("CREATE TABLE IF NOT EXISTS users (firstname, lastname, username, password, email, createdAt, updatedAt)"),
    db.run("CREATE TABLE IF NOT EXISTS sessions (userId, createdAt, updatedAt)")
  ]).then(() => {
    console.log('Database is ready')
  }).catch((err) => {
    console.log('Une erreur est survenue :', err)
  })
})

api.set('views', __dirname + '/views/')
api.set('view engine', 'hbs')

// MIDDLEWARE POUR PARSER LE BODY
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({ extended: false }))
api.use(methodOverride('_method'))

// ROUTES
api.use('/todos', require('./controllers/todos'))
api.use('/users', require('./controllers/users'))

//REDIRECTION
api.all('/', (req, res, next) => {
  res.redirect(301, '/todos')
})

//SESSION
api.use(session({ 
  secret: 'this-is-a-secret-token', 
  store: new FileStore(),
  cookie: { maxAge: 60000 }
  })
)

api.listen(8080);

console.log("http://localhost:8080/");