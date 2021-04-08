const socket = io()
const formMessage = document.getElementById('messageForm')
const message = document.getElementById('message')

socket.on('message', (welcome) => {
    console.log(welcome)
})

formMessage.addEventListener('submit', (e) => {
    e.preventDefault()
    const userMessage = message.value
    socket.emit('sendMessage', userMessage)
})

