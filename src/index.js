const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
//creating server outside of express
const server = http.createServer(app)
//expects the raw http server
const io = socketio(server)

const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', (socket) => {
    console.log('new web socket connection')
    //when a new client connects to server
    socket.emit('message', 'Welcome!')

    //broadcasts all clients except the joining user
    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is prohibited')
        }

        io.emit('message', message)
        callback('Delivered')
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback('Location shared')
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })
})

server.listen(port, () => {
    console.log('listening on port ' + port)
})