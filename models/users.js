const db = require('sqlite')
const _ = require('lodash')

module.exports = {
    getAllUsers() {
        return db.all("SELECT rowid AS id, * FROM users")
    },
    findOneUser(id) {
        return db.get("SELECT rowid AS id, * FROM users WHERE rowid = ?", id)
    },
    async createUser(params) {

        params.createdAt = new Date()
        params.updatedAt = new Date()

        db.all("SELECT username FROM users WHERE username = ?", params.username).then(() => {
            console.log(trow, "La colonne existe !!!!!")
        }).catch(() =>{

            // const token = crypto.randomBytes(256);
            // params.accessToken = token.toString('hex')
    
            const data = _.values(params)
        
            console.log(data)
            console.log("---------User créée-------")
            const { lastID } = db.run("INSERT INTO users VALUES(?, ?, ?, ?, ?, ?, ?)", data)
    
            return this.findOneUser(lastID)
        })
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