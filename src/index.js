const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')

const { generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express()
//creating server outside of express
const server = http.createServer(app)
//expects the raw http server
const io = socketio(server)

const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', (socket) => {
    console.log('new web socket connection')

    socket.on('join', ({ username, room }) => {
        socket.join(room)

        //when a new client connects to server
        socket.emit('message', generateMessage('Welcome!'))
        //broadcasts all clients except the joining user
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined the room.`))

    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is prohibited')
        }

        io.to('fort').emit('message', generateMessage(message))
        callback('Delivered')
    })

    //listens and sends coordinates to console
    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback('Location shared')
    })


    //unique listener, runs when a client closes out the browser
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left'))
    })
})

server.listen(port, () => {
    console.log('listening on port ' + port)
})