const socket = io()


// DOM Elements
let localVideo = document.getElementById('local-video')
let remoteVideo = document.getElementById('remote-video')


// variabels
let peerConnection;
let localStream;
let remoteStream;


const STUN_SERVERS = {
  iceServers : [
    {
      urls : ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
    }
  ]
}

async function init(){
  localStream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  })
 
  localVideo.srcObject = localStream
  createOffer()
}

async function createOffer(){

  let doc_id;

  peerConnection = new RTCPeerConnection(STUN_SERVERS) 

  // initailzing stream for remote
  remoteStream = new MediaStream()
  remoteVideo.srcObject = remoteStream


  //sending tracks 
  localStream.getTracks().forEach(track => {
    console.log(track)
    peerConnection.addTrack(track, localStream)
  });

  //receiving tracks
  peerConnection.ontrack = async (event) =>{
    event.streams[0].getTracks().forEach((track)=>{
      remoteStream.addTrack(track)
    })
  }

  // ice candidates
  peerConnection.onicecandidate = async (event) =>{
    console.log('got event')
    if (event.candidate){
      // peer connection will continue adding more to this variable
      // localOffer.value = JSON.stringify(peerConnection.localDescription)
      console.log(doc_id, " +++ " ,event.candidate)

        
      // socket.emit('ice-candidates', event.candidate, doc_id, (response)=>{
        // console.log("got doc::", response)
      // })

      // addDoc(offerCandidates, event.candidate.toJSON())
    }else{
      console.log("all candidates have been gathered")
    }
  }

  let offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  
  socket.emit('offer', offer, (response)=>{
    console.log("doc id:: ", response)
    doc_id = response
  })

  // console.log("offer::", peerConnection.localDescription )
  

}

let createAnswer = async() => {
   peerConnection = new RTCPeerConnection(STUN_SERVERS) 

  // initailzing stream for remote
  remoteStream = new MediaStream()
  remoteVideo.srcObject = remoteStream


  //sending tracks 
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream)
  });

  //receiving tracks
  peerConnection.ontrack = async (event) =>{
    event.streams[0].getTracks().forEach((track)=>{
      remoteStream.addTrack(track)
    })
  }

  // ice candidates
  peerConnection.onicecandidate = async (event) =>{
    console.log('got ice candidates')
    if (event.candidate){
      // peer connection will continue adding more to this variable
      // localOffer.value = JSON.stringify(peerConnection.localDescription)
    }
  }
  

  // remote offfer
  let offer = ''
  if(!offer){
    return alert('retrive offer first')
  }

  offer = JSON.parse(offer)
  await peerConnection.setRemoteDescription(offer)

  //local localDescription for the peer
  let answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)
  remoteOffer.value = JSON.stringify(answer)
}

let AddAnswer = async () => {
  let answer = JSON.parse(remoteOffer.value)

  if(!peerConnection.currentRemoteDescription){
    peerConnection.setRemoteDescription(answer)
  }


}

init()
