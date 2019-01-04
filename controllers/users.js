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

module.exports = router