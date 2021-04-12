const users = []

//adding user
const addUser = ({ id, username, room }) => {
    //clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    // validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }
    // check for exisiting user
    const existingUser = users.find((user) => {
        return user.room === room & user.username === username
    })
    // validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }
    //store the user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

//remove user
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

//get user
const getUser = (id) => (users.find((user) => user.id === id))

//get users in the room
const getUsersInRoom = (room) => (users.filter(user => user.room === room))

module.exports = {
    addUser,
    getUser,
    getUsersInRoom
}

//checking validation for exisiting users
// addUser({
//     id: 1234,
//     username: 'Johnny',
//     room: 'Fort'
// })

// addUser({
//     id: 4,
//     username: 'Mikel',
//     room: 'Fort'
// })

// addUser({
//     id: 42,
//     username: 'Mikel',
//     room: 'NewYork'
// })

// console.log(getUser(4))
// console.log(getUsersInRoom('fort'))