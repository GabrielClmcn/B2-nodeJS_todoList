const router = require('express').Router()
const Todos = require('./../models/todos')
const moment = require('moment');
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Users = require('./../models/users')

//GET /
router.get('/', (req, res, next) => {

    Users.getAllUsers()
    .then((users) =>
    {
      res.format({
        html: () => { 
            res.render("pass", {  
            title: 'User list',
            })
        },
        json: () => {
            res.json(users)
        }
      })
    })
    .catch((err) => {
      console.log(err)
      return next(err)
    })
  })


  //GET /add 
router.get('/add', (req, res) => {
  console.log('--> GET /users/add')
  res.render('create.hbs')
})

router.post('/add', (req, res) => {
  console.log('--> POST /users/add')
  bcrypt.hash(req.body.pass, 10).then((hash) => {
    console.log(req.body.pass)
    console.log(req.body)
    req.body.pass = hash
    Users.createUser(req.body).then((todo) => {
      res.redirect(301, '/')
      // console.log(req.body)
    }).catch((err) => {
    return res.status(404).send(err)
    })}).catch((err) => {
    return res.status(404).send(err)
    })
  })

//GET /:id  show User informations
router.get('/:id', (req, res, next) => {
    Users.findOneUser(req.params.id).then((user) => {
      res.format({
        html: () => { // Prepare content
  
          let content = ''

          content += '<b> id:</b>'+user.id+'<br>',
          content += '<b> fName:</b>'+user.firstname+'<br>',
          content += '<b> lName:</b>'+user.lastname+'<br>',
          content += '<b> userName:</b>'+user.username+'<br>',
          content += '<b> mail:</b>'+user.email+'<br>',
  
          res.render("show", {  
            title: 'Profil de ' + user['username'],
            content: content
          })
        },
        json: () => {
          res.json(user)
        }
      })
    })
    .catch((err) => {
      console.log(err)
      return next(err)
    })
  })

//GET /:id/edit
router.get('/:id/edit-1', (req, res) => {
  console.log('--> GET /:id/edit (id : ', req.params.id, ')')
  res.render('edit-1',
  {
  title: 'Bonjour !',
  content: "MA PAGE"
  })
})

  module.exports = router