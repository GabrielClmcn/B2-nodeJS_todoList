const db = require('sqlite')
const _ = require('lodash')

module.exports = {
    getAllUsers() {
        return db.all("SELECT rowid AS id, * FROM users")
    },

    userConnect(id) {
        db.each("SELECT rowid AS userid, createdAt, updatedAt FROM users WHERE userid = ?", id, (err, row) => {
            if(row){
                console.log("ROW : ", row)
                db.run("INSERT INTO sessions VALUES(?,?,?)", row.userid, row.createdAt, row.updatedAt)
            }else   console.log(err);
        })
        return db.get("SELECT userId FROM sessions WHERE rowid = (SELECT MAX(rowid) FROM sessions)")
    },

    findLastUser() {
         return db.get("SELECT userId FROM sessions WHERE rowid = (SELECT MAX(rowid) FROM sessions)")
    },

    findOneUser(id) {
        return db.get("SELECT rowid AS id, * FROM users WHERE id = ?", id)
   },
   findUsername(username) {
    return db.get("SELECT rowid AS id, * FROM users WHERE username = ?", username)
},

    async createUser(params) {

        params.createdAt = new Date()
        params.updatedAt = new Date()
        console.log("JE SUIS DANS CREATEUSER")
        const data = _.values(params)
                
        console.log(data ,"Models/Users")
        console.log("---------User créée-------")
        const { lastID } = await db.run("INSERT INTO users VALUES(?, ?, ?, ?, ?, ?, ?)", data)
        console.log("LASTID : ", lastID)
        this.userConnect(lastID)
        return this.findOneUser(lastID)
        
    },

    deleteUser(id) {
        return db.run("DELETE FROM users WHERE rowid = ?", id)
    },
    
    async updateUser(params) {
        let string = ''
    
        for (k in params) {
          if (k !== 'id') {
            string += k + ' = ?,'
          }
        }
    
        string = string.substring(0, string.length - 1); // Remove last comma
    
        const data = _.values(params)
        const { changes } = await db.run("UPDATE users SET " + string + " WHERE rowid = ?", data)
        
        if (changes !== 0) {
          return this.findOneUser(params.id)
        } else {
          return Promise.reject({ message: 'Could not find id' })
        }
      },
}