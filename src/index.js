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

io.on('connection', () => {
    console.log('new web socket connection')
})

server.listen(port, () => {
    console.log('listening on port ' + port)
})