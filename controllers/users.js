const router = require('express').Router()
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
    console.log(req.body.pass, "Controllers/Users")
    console.log(req.body.username, "Controllers/Users")
    req.body.pass = hash
    Users.createUser(req.body).then((todo) => {
      console.log(todo.userId)
      res.redirect(301, "/users/"+todo.userId+"")
      // console.log(req.body)
    }).catch((err) => {
    return res.status(404).send(err)
    })}).catch((err) => {
    return res.status(404).send(err)
    })
  })

//GET /:id  show User informations
router.get('/:id', (req, res, next) => {
    Users.findLastUser().then((users) => {
      console.log(users.userId)
      Users.findOneUser(users.userId).then((user) => {
      res.format({
        html: () => { // Prepare content
  
          let content = ''

          content += '<b> id:</b>'+user.id+'<br>',
          content += '<b> firsName:</b>'+user.firstname+'<br>',
          content += '<b> lastName:</b>'+user.lastname+'<br>',
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

//GET /:id/todos
router.get('/:id/todos', (req, res) => {
  // Users.findLastUser().then((users) =>{
  //   Users.findOneUser(users.userId).then((user) =>{
  Todos.getAllTodos().then((todos) => {

    res.format({
      html: () => {//prepare content
        let content = ''

        todos.forEach((todo) => {
          content += '<div style="border: 1px solid black; margin: 15px; width: 900px"><h2 style="width: 100px; display: inline; margin-left: 30px">' + todo.id + '. ' + todo.name + '</h2>';
          content += '<p style="width: 300px; display: inline; margin-left: 30px">' + 'Status : ' + todo['completion'] + '</p>';
          content += '<p style="width: 300px; display: inline; margin-left: 30px"> Created at :' + moment(todo['createdAt']).format('MMMM Do YYYY, h:mm:ss a') + '</p>';
          content += '<p style="width: 300px; display: inline; margin-left: 30px"> Updated at :' + moment(todo['updatedAt']).format('MMMM Do YYYY, h:mm:ss a') + '</p></div>';
        });
        //console.log(content)
          res.render("show", {
              title: 'Todo List',
              content: content
          })
      },
      json: () => {
          res.json(todos)
      }
    })
  }).catch((err) => {
    return res.status(404).send(err)
  })
})


  module.exports = router