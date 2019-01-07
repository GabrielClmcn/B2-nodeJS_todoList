const router = require('express').Router()
const Todos = require('./../models/todos')
const moment = require('moment');
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Users = require('./../models/users')

// / -- index
//GET / --- FONCTIONNE
router.get('/', (req, res) => {
    Users.findLastUser().then((user) => {
        Todos.getAllTodos().then((todos) => {
            let id = user.userId
            res.format({
                html: () => {
                    let content = ''

                    todos.forEach((todo) => {
                        content += '<div style="border: 1px solid black; margin: 15px; width: 1500px"><h2 style="width: 100px; display: inline; margin-left: 30px">' + todo['message'] + '</h2>';
                        content += '<p style="width: 300px; display: inline; margin-left: 30px">' + 'Status : ' + todo['completion'] + '</p>';
                        content += '<p style="width: 300px; display: inline; margin-left: 30px"> Created at :' + moment(todo['createdAt']).format('MMMM Do YYYY, h:mm:ss a') + '</p>';
                        content += '<p style="width: 300px; display: inline; margin-left: 30px"> Updated at :' + moment(todo['updatedAt']).format('MMMM Do YYYY, h:mm:ss a') + '</p>';
                        content += '<label for="completion" style="width: 300px; margin-left: 30px">Fait ?</label>';
                        content += '<input type="checkbox" name="completion" style="width: 30px; margin-right: 10px; margin-top: 10px">';
                        content += '<form action="/todos/'+todo['id']+'?_method=DELETE", method="POST"> <button type="submit" style="height: 30px; width: 100px; margin-left: 200px; margin-top: 10px">Supprimer</form>' //Suppr
                        content += '<form action="/todos/'+todo['id']+'/edit/"> <button type="submit" style="height: 30px; width: 100px; margin-left: 200px; margin-top: 10px">Modifier</form>' //Modif
                        content += '<form action="/todos/'+todo['id']+'" method="POST"> <button type="submit" style="height: 30px; width: 100px; margin-left: 200px; margin-top: 10px">Voir</form></div>' //Voir
                        // console.log(todo.id)
                    });
                    res.render('index', {
                    title: 'TODO LIST',
                    content: content,
                    id: id
                    })
                },
                json: () => {
                    res.json(todos)
                }
            })
        }).catch((err) => {
        return res.status(404).send(err)
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
    }).catch((err) => {
    return res.status(404).send(err)
    })
})

// /add -- edit
//GET /add 
router.get('/add', (req, res) => {
    console.log('--> GET /add')
    Users.findLastUser().then((user) => {
        let id = user.userId
        res.render('edit', {
            id: id
        })
    }).catch((err) => {
    return res.status(404).send(err)
    })
})

//POST /add --- A SUPPRIMER TOUT DANS LE GET /ADD
router.post('/add', (req, res) => {
    if (!req.body.completion) req.body.completion = "NON FAIT"
    else req.body.completion = "FAIT"
    Users.findLastUser().then((user) => {
        Todos.createTodo(req.body, user.userId).then((todo) => {
        //   console.log("REQ.BODY:", todo)
            res.redirect(301, '/todos')
            //   console.log("REQ.BODY:", todo)
            }).catch((err) => {
                return res.status(404).send(err)
            })
    }).catch((err) => {
        return res.status(404).send(err)
    })
})
  

//GET /:id
router.get('/:id', (req, res) => {
    Users.findLastUser().then((user) => {
        let id = user.userId
        Todos.findOneTodo(req.params.id).then((todo) => {
            res.format({
                html: () => {
                    let content = ''

                        todos.forEach((todo) => {
                            content += '<div style="border: 1px solid black; margin: 15px; width: 1500px"><h2 style="width: 100px; display: inline; margin-left: 30px">' + todo['message'] + '</h2>';
                            content += '<p style="width: 300px; display: inline; margin-left: 30px">' + 'Status : ' + todo['completion'] + '</p>';
                            content += '<p style="width: 300px; display: inline; margin-left: 30px"> Created at :' + moment(todo['createdAt']).format('MMMM Do YYYY, h:mm:ss a') + '</p>';
                            content += '<p style="width: 300px; display: inline; margin-left: 30px"> Updated at :' + moment(todo['updatedAt']).format('MMMM Do YYYY, h:mm:ss a') + '</p>';
                            content += '<label for="completion" style="width: 300px; margin-left: 30px">Fait ?</label>';
                            content += '<input type="checkbox" name="completion" style="width: 30px; margin-right: 10px; margin-top: 10px">';
                            content += '<form action="/todos/'+todo['id']+'?_method=DELETE", method="POST"> <button type="submit" style="height: 30px; width: 100px; margin-left: 200px; margin-top: 10px">Supprimer</form>' //Suppr
                            content += '<form action="/todos/'+todo['id']+'/edit/"> <button type="submit" style="height: 30px; width: 100px; margin-left: 200px; margin-top: 10px">Modifier</form>' //Modif
                            // console.log(todo.message)
                        });
                    res.render('show', {
                        content: content,
                        id: id
                    })
                },
                json: () => {
                    res.json(todo)
                }
            })
        }).catch((err) => {
            return res.status(404).send(err)
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
    Users.findLastUser().then((user) => {
        let id = user.userId
        Todos.findOneTodo(req.params.id).then((todo) => {
            res.render("edit", {
            title: "Edit a todo",
            content: todo.message,
            id: id
            })
        }).catch((err) => {
            return res.status(404).send(err)
            })
    }).catch((err) => {
        return res.status(404).send(err)
    })
})

router.post('/:id/edit', (req, res) => {
    Todos.updateTodo(req.body, req.params.id).then((todo) => {
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