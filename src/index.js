const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')

const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { getUser, getUsersInRoom, addUser, removeUser } = require('./utils/users')
const { get } = require('https')

const app = express()
//creating server outside of express
const server = http.createServer(app)
//expects the raw http server
const io = socketio(server)

const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', (socket) => {
    console.log('new web socket connection')

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        //when a new client connects to server
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        //broadcasts all clients except the joining user
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined the room.`))
        //user is able to join
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        const user = getUser(socket.id)

        if (filter.isProfane(message)) {
            return callback('Profanity is prohibited')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback('Delivered')
    })

    //listens and sends coordinates to console
    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback('Location shared')
    })


    //unique listener, runs when a client closes out the browser
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left the room.`))
        }
    })
})

server.listen(port, () => {
    console.log('listening on port ' + port)
})