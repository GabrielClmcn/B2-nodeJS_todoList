const router = require('express').Router()
const moment = require('moment');
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Users = require('./../models/users')
const Todos = require('./../models/todos')


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

  router.post('/', (req, res) => {
    console.log('--> POST /users')
    Users.findUsername(req.body.username).then((user) => {
        console.log(req.body.pass, "Controllers/Users REQ.BODY.PASSWORD")
        console.log(user.password, "Controllers/Users USER.PASSWORD")
        bcrypt.compare(req.body.pass, user.password, (err, result) => {
          if(result == true){
            Users.userConnect(user.id).then((use) => {
           res.redirect(301, "/users/"+use.userId+"")
            })
           console.log("CEST BOOOOOON")
          }else return res.status(404).send(err)
        })
      }).catch((err) => {
      return res.status(404).send(err)
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
      // if(todo == undefined) {
      //   todo = 1
      // }
      console.log("TODO.USERID : ", todo)
      res.redirect(301, "/users/"+todo.id+"")
      
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
        let id = user.id
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
            content: content,
            id: id
          })
        },
        json: () => {
          res.json(user)
        }
      })
  }).catch((err) => {
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
  Users.findLastUser().then((users) =>{
    Users.findOneUser(users.userId).then((user) =>{
      console.log("USER -> TODOS:", user.id)

  Todos.getTodosOneUser(user.id).then((todos) => {
    console.log("TODOS :", todos)
    res.format({
      html: () => {//prepare content
        let content = ''

        todos.forEach((todo) => {
          console.log("TODO :", todo)
          content += '<div style="border: 1px solid black; margin: 15px; width: 900px"><h2 style="width: 100px; display: inline; margin-left: 30px">' + todo.id + '. ' + todo.message + '</h2>';
          content += '<p style="width: 300px; display: inline; margin-left: 30px">' + 'Status : ' + todo['completion'] + '</p>';
          content += '<p style="width: 300px; display: inline; margin-left: 30px"> Created at :' + moment(todo['createdAt']).format('MMMM Do YYYY, h:mm:ss a') + '</p>';
          content += '<p style="width: 300px; display: inline; margin-left: 30px"> Updated at :' + moment(todo['updatedAt']).format('MMMM Do YYYY, h:mm:ss a') + '</p></div>';
        });
        //console.log(content)
          res.render("index", {
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
})//findOneUser
})//findLastUser
})

//404
router.use((req, res) => {
  res.format({
      html: () => {
          res.render('404', {
              title: 'Page non trouvé',
              content: 'Page 404, mauvais chemin !'
          })
      },
      json: () => {
          res.json({message : 'Page 404, mauvais chemin !'})
      }
  })
})

  module.exports = router