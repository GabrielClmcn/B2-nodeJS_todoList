const db = require('sqlite')
const _ = require('lodash')

module.exports = {
    getAllUsers() {
        return db.all("SELECT rowid AS id, * FROM users")
    },

    userConnect(id) {
        db.each("SELECT rowid AS userid FROM users WHERE userid = ?", id, (err, row) => {
            if(row){
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

    async createUser(params) {

        params.createdAt = new Date()
        params.updatedAt = new Date()
        console.log("JE SUIS DANS CREATEUSER")
        const data = _.values(params)
                
        console.log(data ,"Models/Users")
        console.log("---------User créée-------")
        const { lastID } = await db.run("INSERT INTO users VALUES(?, ?, ?, ?, ?, ?, ?)", data)
           
        return this.userConnect(lastID)
        
        // db.each("SELECT username FROM users WHERE username = ?", params.username, (err, row) => {
        //     if(row.username.length != null) {
        //         console.log(params.username, "Models/Users")
        //         console.log(row, "La colonne existe !!!!!")
        //         console.log(row.username, "LA COLONNE EXISTE ")
        //     }else {
        // console.log(row.username, "LA COLONNE EXISTE 2")
        // console.log(row, "LA COLONNE EXISTE 3")

                    //CREATION DE TOKEN
                    // const token = crypto.randomBytes(256);
                    // params.accessToken = token.toString('hex')
            
        
            // }
        // })
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