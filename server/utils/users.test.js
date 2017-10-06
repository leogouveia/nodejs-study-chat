const expect = require('expect')
const _ = require('lodash')

const {User, Users} = require('./users')

describe('users => User, Users', () => {
    let user
    let users 

    beforeEach(() => {
        users = new Users()
        user = new User(4, 'Maria', 'AnotherRoom')
        users._ = [
            new User(1, 'Leo', 'MyRoom'),
            new User(2, 'Mario', 'MyRoom'),
            new User(3, 'Emmanuel', 'AnotherRoom'),
            user
        ]
    })
    it('should create an user', () => {
        expect(user.constructor.name).toBe('User')
        expect(user.id).toBe(4)
        expect(user.name).toBe('Maria')
        expect(user.room).toBe('AnotherRoom')
    })
    it('should add an user', () => {
        users.add(
            new User(5, 'Fernando', 'AnotherRoom')
        )
        expect(users.length).toBe(5)
        expect(_.last(users._).id).toBe(5)

    })
    it('should get an user', () => {
        expect(users.get(3).id).toBe(3)
        expect(users.get(3).name).toBe('Emmanuel')
        expect(users.get(2).name).toBe('Mario')
        expect(users.get(2).room).toBe('MyRoom')
        expect(users.get(99)).toBeFalsy()
    })
    it('should remove an user', () => {
        users.remove(user)
        expect(users.length).toBe(4)
        expect(users.remove(99)).toBeFalsy()
    })
    it('shoult get users in the room', () => {
        expect(users.inTheRoom('MyRoom').length).toBe(2)
    }) 
    it('should get index of Id in users array', () => {
        expect(users.indexOfId(1)).toBe(0)
    }) 
})