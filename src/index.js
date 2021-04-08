const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express()
//creating server outside of express
const server = http.createServer(app)
//expects the raw http server
const io = socketio(server)

const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', (socket) => {
    console.log('new web socket connection')

    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has joined!')
    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })
})

server.listen(port, () => {
    console.log('listening on port ' + port)
})