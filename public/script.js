const socket = io('/');
const videoGrid = document.getElementById('video-grid')
// const myPeer = new Peer(undefined, {
//     host: '/',
//     port: '3001'
// })

const myPeer = new Peer(undefined, { host: "peerjs-server.herokuapp.com", secure: true, port: 443, });

const myVideo = document.createElement('video')
myVideo.muted = true

const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream) 
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
           addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userID =>{
        setTimeout(()=>{
            connectToNewUser(userID, stream)
        },1000)
    })

    socket.on('user-disconnected', userID =>{
        console.log(userID)
        if(peers[userID]) peers[userID].close()
    })
        
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
    console.log(ROOM_ID, id)
})

function connectToNewUser(userID, stream){
    const call = myPeer.call(userID, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })

    call.on('close',() => {
        video.remove()
    })

    peers[userID] = call

}

function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

