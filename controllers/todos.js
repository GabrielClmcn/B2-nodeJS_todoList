const router = require('express').Router()
const Todos = require('./../models/todos')
const _ = require('lodash')

// router.get('/', (req, res) => {
//   Todos.getAllTodos().then((todos) => res.json(todos)).catch((err) => {
//     return res.status(404).send(err)
//   })
// })

router.get('/', (req, res) => {
  Todos.getAllTodos().then((todos) => {

    res.format({
      html: () => {//prepare content
        let content = ''

        todos.forEach((todo) => {
          content += '<div><h2>' + todo.id + '. ' + todo.name + '</h2>';
          content += '<p>' + 'Status : ' + todo['completion'] + '</p>';
          content += '<p> Created at ' + todo['createdAt'] + '</p>';
          content += '<p> Updated at ' + todo['updatedAt'] + '</p></div>';
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

router.get('/add', (req, res) => {
  console.log('--> GET /add')
  res.render('edit',
  {
  title: 'Bonjour !'
  })
})

router.get('/:id/edit', (req, res) => {
  console.log('--> GET /:id/edit (id : ', req.params.id, ')')
  res.render('edit',
  {
  title: 'Bonjour !',
  content: "MA PAGE"
  })
})

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


router.post('/', (req, res) => {
  console.log(req.body)
  if (!req.body || (req.body && (!req.body.name || !req.body.completion))) 
  return res.status(404).send('NOT FOUND')

  Todos.createTodo(req.body).then((todo) => {
    res.format({
      html: () => {
        res.redirect(301, '/todos')
      },
      
      json: () => {
        res.json(todos)
      }
    })
  })
  // res.json(todo)).catch((err) => {
  // return res.status(404).send(err)
})

router.patch('/:id', (req, res) => {
  if (!req.params.id) return res.status(404).send('NOT FOUND')
  req.body.updatedAt = new Date() // Update time
  req.body.id = req.params.id // Add id to body
  Todos.updateTodo(req.body).then((todo) => res.json(todo)).catch((err) => {
    return res.status(404).send(err)
  })
})

router.delete('/:id', (req, res) => {
  if (!req.params.id) return res.status(404).send('NOT FOUND')
  Todos.deleteTodo(req.params.id).then(() => res.json({ message: 'Todo supprimée avec succès' })).catch((err) => {
    return res.status(404).send(err)
  })
})

module.exports = router
