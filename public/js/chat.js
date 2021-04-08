const socket = io()
const formMessage = document.getElementById('messageForm')
const locationBtn = document.getElementById('sendLocation')
const message = document.getElementById('message')

socket.on('message', (welcome) => {
    console.log(welcome)
})

formMessage.addEventListener('submit', (e) => {
    e.preventDefault()
    const userMessage = message.value
    socket.emit('sendMessage', userMessage)
})
locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})
