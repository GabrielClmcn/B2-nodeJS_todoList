const router = require('express').Router()
const Todos = require('./../models/todos')
const moment = require('moment');
const _ = require('lodash')

//GET /
router.get('/', (req, res) => {
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
        console.log(content)
        //console.log(todos)
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
//GET /add
router.get('/add', (req, res) => {
  console.log('--> GET /add')
  res.render('edit.hbs')
})

router.post('/add', (req, res) => {
  if (!req.body.completion) req.body.completion = "NON FAIT"
  else req.body.completion = "FAIT"
  console.log(req.body.completion)
  Todos.createTodo(req.body).then((todo) => {
    res.redirect(301, '/')
    console.log(req.body)
  })
})
//GET /:id
router.get('/:id', (req, res) => {
  console.log('--> GET /:id (id : ', req.params.id, ')')
  if (!req.params.id) return res.status(404).send('NOT FOUND')
  Todos.findOneTodo(req.params.id).then((todo) =>
  res.render('index',
  {
  title: 'Bonjour !',
  name: todo.name,
  content: "MA PAGE",
  })
  ).catch((err) => {
    return res.status(404).send(err)
  })
})
//GET /:id/edit
router.get('/:id/edit', (req, res) => {
  console.log('--> GET /:id/edit (id : ', req.params.id, ')')
  res.render('edit',
  {
  title: 'Bonjour !',
  content: "MA PAGE"
  })
})

//POST for /:id/edit. Editing todo
router.post('/:id/edit', (req, res) => {
  if (!req.body.completion) req.body.completion = "NON FAIT"
  else req.body.completion = "FAIT"
  Todos.createTodo(req.body).then((todo) => {
    res.redirect(301, '/')
  })
  console.log(req.body)
})
//POST for /add. Adding a todo
router.post('/add', (req, res) => {
  if (!req.body.completion) req.body.completion = "NON FAIT"
  else req.body.completion = "FAIT"
  console.log(req.body.completion)
  Todos.createTodo(req.body).then((todo) => {
    res.redirect(301, '/')
    console.log(req.body)
  })
})

//POST + redirect 301 and json for /
router.post('/', (req, res) => {
  console.log(req.body)
  if (!req.body || (req.body && (!req.body.name || !req.body.completion))) 
  return res.status(404).send('NOT FOUND')

  Todos.createTodo(req.body).then((todo) => {
    res.format({
      html: () => {
        res.redirect(301, '/')
      },
      json: () => {
        res.json( 'Todo ajouté avec succès')
      }
    })
  }).catch((err) => {
    return res.status(404).send(err)
  })
})

//PATCH + redirect 301 and json for /:id
router.patch('/:id', (req, res) => {
  if (!req.params.id) return res.status(404).send('NOT FOUND')
  req.body.updatedAt = new Date() // Update time
  req.body.id = req.params.id // Add id to body
  Todos.updateTodo(req.body).then((todo) => {
    res.format({
      html: () => {
        res.redirect(301, '/')
      },
      json: () => {
        res.json({message : 'Todo modifié avec succès'})
      }
    })
  }).catch((err) => {
    return res.status(404).send(err)
  })
})

//DELETE + redirect 301 and json for /:id
router.delete('/:id', (req, res) => {
  if (!req.params.id) return res.status(404).send('NOT FOUND')
  Todos.deleteTodo(req.params.id).then(() => {
    res.format({
      html: () => {
        res.redirect(301, '/')
      },
      json: () => {
        res.json({message : 'Todo supprimée avec succès'})
      }
    })
  }).catch((err) => {
    return res.status(404).send(err)
  })
})

module.exports = router
