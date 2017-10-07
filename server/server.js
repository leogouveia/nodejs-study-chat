const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {generateMessage, generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation')
const {User, Users} = require('./utils/users')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;
var app = express()
var server = http.createServer(app)
var io = socketIO(server)

const users = new Users()


app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('new user connected')


    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) 
            return callback(undefined, 'Name or room name are required')
        
        socket.join(params.room)
        console.log(`User ${socket.id} joined`)
        users.remove(socket.id)
        users.add(new User(socket.id, params.name, params.room))

        //socket.leave('name of the room')
        io.to(params.room).emit('updateUserList', users.inTheRoom(params.room))
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'))
        
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined`))
        
        callback(users.get(socket.id))
    })

    socket.on('createMessage', (message, callback) => {
        let user = users.get(socket.id)
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text))
        }
        //callback()
    })

    socket.on('createLocationMessage', (coords) => {
        let user = users.get(socket.id)
        if (user) 
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
    })

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`)
        let user = users.remove(socket.id)
        console.log(user)
        if(user) {
            io.to(user.room).emit('updateUserList', users.inTheRoom(user.room))
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`))
            console.log(`User ${socket.id} has left the room`, users.inTheRoom(user.room))
        }
    })
    
})


server.listen(port, () => {
    console.log(`Started on port ${port}`)
})

// module.exports = {app, server}