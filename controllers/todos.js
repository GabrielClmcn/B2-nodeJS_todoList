const router = require('express').Router()
const Todos = require('./../models/todos')
const _ = require('lodash')

router.get('/', (req, res) => {
  Todos.getAll().then((todos) => res.json(todos)).catch((err) => {
    return res.status(404).send(err)
  })
})

// router.post('/add', (req, res) => {
//   Todos.create(req.body).then((todo) => {
//     res.json(todo)
//   }).catch((err) =>{
//     return res.status(404).send(err)
//   })
// })

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
  Todos.findOne(req.params.id).then((todo) =>
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

  Todos.create(req.body).then((todo) => res.json(todo)).catch((err) => {
    return res.status(404).send(err)
  })
})

router.patch('/:id', (req, res) => {
  if (!req.params.id) return res.status(404).send('NOT FOUND')
  req.body.updated_at = new Date() // Update time
  req.body.id = req.params.id // Add id to body
  Todos.update(req.body).then((todo) => res.json(todo)).catch((err) => {
    return res.status(404).send(err)
  })
})

router.delete('/:id', (req, res) => {
  if (!req.params.id) return res.status(404).send('NOT FOUND')
  Todos.delete(req.params.id).then(() => res.json({ message: 'Todo supprimée avec succès' })).catch((err) => {
    return res.status(404).send(err)
  })
})

module.exports = router
