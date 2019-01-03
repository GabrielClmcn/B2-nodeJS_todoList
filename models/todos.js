const db = require('sqlite')
const _ = require('lodash')

module.exports = {
  getAllTodos() {
    return db.all("SELECT rowid AS id, * FROM todos")
  },

  findOneTodo(id) {
    return db.get("SELECT rowid AS id, name FROM todos WHERE rowid = ?", id)
  },
  async createTodo(params) {

    params.createdAt = new Date()
    params.updatedAt = new Date()
    const data = _.values(params)

    console.log(data)
    
    const { lastID } = await db.run("INSERT INTO todos VALUES(?,?,?,?)", data)
    return this.findOneTodo(lastID)
  },
  
  deleteTodo(id) {
    return db.run("DELETE FROM todos WHERE rowid = ?", id)
  },

  async updateTodo(params) {
    let string = ''

    for (k in params) {
      if (k !== 'id') {
        string += k + ' = ?,'
      }
    }

    string = string.substring(0, string.length - 1); // Remove last comma

    const data = _.values(params)
    const { changes } = await db.run("UPDATE todos SET " + string + " WHERE rowid = ?", data)
    
    if (changes !== 0) {
      return this.findOneTodo(params.id)
    } else {
      return Promise.reject({ message: 'Could not find id' })
    }
  },
}