const express = require('express')
const app = express()
const server = require('http').createServer(app)
const socketio = require('socket.io')
const io = socketio(server)
const {v4 : uuidV4} = require('uuid')
app.set('view engine', 'ejs')
app.use(express.static('public'))  

io.on('connection', socket => {
    socket.on('join-room', (roomID, userID) => {
        socket.join(roomID)
        socket.broadcast.to(roomID).emit('user-connected', userID)

        socket.on('disconnect', () => {
            socket.broadcast.to(roomID).emit('user-disconnected', userID)
        })
    })
    
})

app.get('/', (req, res)=>{
    res.redirect(`/${uuidV4()}`)

})

app.get('/:room', (req, res)=>{
    res.render('room', {roomId: req.params.room})
})


server.listen(process.env.PORT || 3000, () => {
    console.log("The server is running successfully")
})