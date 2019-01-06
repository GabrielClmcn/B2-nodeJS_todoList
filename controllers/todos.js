const router = require('express').Router()
const Todos = require('./../models/todos')
const moment = require('moment');
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Users = require('./../models/users')

// / -- index
//GET / --- FONCTIONNE
router.get('/', (req, res) => {
    Todos.getAllTodos().then((todos) => {

        res.format({
            html: () => {
                let content = ''
                let id = ''

                todos.forEach((todo) => {
                    id = Users['name'],
                    content += '<div style="border: 1px solid black; margin: 15px; width: 1500px"><h2 style="width: 100px; display: inline; margin-left: 30px">' + todo.id + '. ' + todo.name + '</h2>';
                    content += '<p style="width: 300px; display: inline; margin-left: 30px">' + 'Status : ' + todo['completion'] + '</p>';
                    content += '<p style="width: 300px; display: inline; margin-left: 30px"> Created at :' + moment(todo['createdAt']).format('MMMM Do YYYY, h:mm:ss a') + '</p>';
                    content += '<p style="width: 300px; display: inline; margin-left: 30px"> Updated at :' + moment(todo['updatedAt']).format('MMMM Do YYYY, h:mm:ss a') + '</p>';
                    content += '<label for="completion" style="width: 300px; margin-left: 30px">Fait ?</label>';
                    content += '<input type="checkbox" name="completion" style="width: 30px; margin-right: 10px; margin-top: 10px">';
                    content += '<form action="/todos/'+todo['id']+'?_method=DELETE", method="POST"> <button type="submit" style="height: 30px; width: 100px; margin-left: 200px; margin-top: 10px">Supprimer</form>' //Suppr
                    content += '<form action="/todos/'+todo['id']+'/edit/"> <button type="submit" style="height: 30px; width: 100px; margin-left: 200px; margin-top: 10px">Modifier</form>' //Modif
                    content += '<form action="/todos/'+todo['id']+'"> <button type="submit" style="height: 30px; width: 100px; margin-left: 200px; margin-top: 10px">Voir</form></div>' //Voir
                });
                res.render('index', {
                    title: 'TODO LIST',
                    content: content,
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
//POST /
router.post('/', (req, res) => {
    Todos.createTodo(req.body).then((todo) => {
        res.format({
            html: () => {
                res.redirect(301, '/')
            },
            json: () => {
                res.json('Todo ajouté avec succès')
            }
        })
    }).catch((err) => {
        return res.status(404).send(err)
    })
})

// /add -- edit
//GET /add 
router.get('/add', (req, res) => {
    console.log('--> GET /add')
    res.render('edit')
})

//POST /add --- A SUPPRIMER TOUT DANS LE GET /ADD
router.post('/add', (req, res) => {
    if (!req.body.completion) req.body.completion = "NON FAIT"
    else req.body.completion = "FAIT"
    console.log(req.body.completion)
    Todos.createTodo(req.body).then((todo) => {
      res.redirect(301, '/')
      console.log(req.body)
    })
  })
  


// /:id -- show --- FONCTIONNE
//GET /:id
router.get('/:id', (req, res) => {
    Todos.findOneTodo(req.params.id).then((todo) => {
    res.format({
        html: () => {
            res.render('show', {
                title: 'cc',
                content: todo.name,
            })
        },
        json: () => {
            res.json(todo)
        }
    })
}).catch((err) => {
    return res.status(404).send(err)})
})
//PATCH /:id --- A FINIR
router.patch('/:id', (req, res) => {
    Todos.updateTodo(req.params.id).then((todo) => {
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
//DELETE /:id -- index --- FONCTIONNE
router.delete('/:id', (req, res) => {
    Todos.deleteTodo(req.params.id).then(() => {
        res.format({
            html: () => {
                res.redirect(301, '/')
            },
            json: () => {
                res.json({message : 'Todo supprimé avec succès'})
            }
        })
    }).catch((err) => {
        return res.status(404).send(err)
    })
})


//GET /:id/edit -- edit --- A FINIR
router.get('/:id/edit', (req, res, next) => {
    if (req.params.id % 1 !== 0) {
      return next(new Error("404 NOT FOUND"))
    }
  if (!req.body.completion) req.body.completion = "NON FAIT"
  else req.body.completion = "FAIT"
  Todos.findOneTodo(req.params.id).then((todo) => {
    res.render("edit", {
      title: "Edit a todo",
      content: todo.name,
      idAndMethod: req.body.name
    })
  })
  console.log(req.body)
})


// 404 --- FONCTIONNE
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