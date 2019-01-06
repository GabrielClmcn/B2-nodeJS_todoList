const db = require('sqlite')
const _ = require('lodash')
const Users = require('./../models/users')

module.exports = {
  getAllTodos() {
    return db.all("SELECT rowid AS id, * FROM todos")
  },
  getTodosOneUser(id) {
    return db.all("SELECT rowid AS id, * FROM todos WHERE userId = ?", id)
  },

  findOneTodo(id) {
    return db.get("SELECT rowid AS id, message FROM todos WHERE rowid = ?", id)
  },
  async createTodo(params, lastUser) {
    // console.log("lasUser : ", lastUser.userId)
    params.createdAt = new Date()
    params.updatedAt = new Date()
    const data = _.values(params)
    data.unshift(lastUser)

    console.log("PARAMS : ", params)
    console.log("DATA : ", data)
    
    const { lastID } = await db.run("INSERT INTO todos VALUES(?,?,?,?,?)", data)
    console.log("lastID : ", lastID)
    return this.findOneTodo(lastID)
  },
  
  deleteTodo(id) {
    return db.run("DELETE FROM todos WHERE rowid = ?", id)
  },

  async updateTodo(params, todoId) {
    let string = ''

    for (k in params) {
      if (k !== 'id') {
        string += k + ' = ?,'
      }
    }

    string = string.substring(0, string.length - 1); // Remove last comma
    const data = _.values(params)
    const { changes } = await db.run("UPDATE todos SET " + string + " WHERE rowid = "+todoId+"", data)
    
    if (changes !== 0) {
      return this.findOneTodo(params.id)
    } else {
      return Promise.reject({ message: 'Could not find id' })
    }
  },
}