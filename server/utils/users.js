let _ = require('lodash')

class User {
    constructor(id, name, room) {
        this.id = id
        this.name = name
        this.room = room
    }
}

class Users {
    constructor() {
        this._users = []
    }

    add(user) {
        this._users.push(user)
    }

    remove(id) {
        let ix = this.indexOfId(id)
        if(ix) 
            return _.pullAt(this._users, this.indexOfId(ix))
        else
            return false
    }

    get(id) {
        let user = _.find(this._users, {id})
        return (user) ? user : false
    }
    
    indexOfId(id) {
        let ix = _.findIndex(this._users, {id})
        return (ix > -1) ? ix : false
    }

    inTheRoom(room) {
        return this._users.filter((user) => user.room === room)
    }

    get _() {
        return this._users
    }

    set _(users) {
        this._users = users
    }

    get list() {
        return this._users
    }

    get length() {
        return this._users.length
    }
}

module.exports = {User, Users}
//CRUD
//user.add
//user.remove
//user.get
//user.getAll