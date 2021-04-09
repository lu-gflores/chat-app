const socket = io()

const formMessage = document.getElementById('messageForm')
const messageInputBtn = document.getElementById('send')
const messageText = document.getElementById('message')
const messages = document.getElementById('messages')
const locationBtn = document.getElementById('sendLocation')

const messageTemplate = document.getElementById('message-template').innerHTML
const locationTemplate = document.getElementById('location-template').innerHTML

//message event
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
})

//rendering location to html
socket.on('locationMessage', (message) => {
    console.log(message)
    const locationURL = Mustache.render(locationTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', locationURL)
})

formMessage.addEventListener('submit', (e) => {
    e.preventDefault()

    //disable form
    messageInputBtn.setAttribute('disabled', 'disabled')

    const userMessage = message.value
    socket.emit('sendMessage', userMessage, (error) => {
        //re-enable form
        messageInputBtn.removeAttribute('disabled', 'disabled')
        messageText.value = ''
        messageText.focus()
        //sends error if a bad word is in the message
        if (error) return console.log(error)
        console.log('Message delivered!')
    })
})

locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    locationBtn.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            locationBtn.removeAttribute('disabled', 'disabled')
            console.log('Location shared')
        })


    })
})
