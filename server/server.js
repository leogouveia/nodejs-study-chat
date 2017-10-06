const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {generateMessage, generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;
var app = express()
var server = http.createServer(app)
var io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('new user connected')


    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) 
            callback('Name or room name are required')
        
        socket.join(params.room)
        //socket.leave('name of the room')

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'))
        
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined`))
        
        callback()
    })



   

    socket.on('createMessage', (message, callback) => {
        console.log(message)
        io.emit('newMessage', generateMessage(message.from, message.text))
        callback('This is from server')

    })

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
    })
    
})


server.listen(port, () => {
    console.log(`Started on port ${port}`)
})

// module.exports = {app, server}