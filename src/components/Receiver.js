import React from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Receiver = () => {
    const webSocket = new WebSocket("ws://localhost:5000");
webSocket.onmessage = (event) => {
    handleSignallingData(JSON.parse(event.data))
}

function handleSignallingData(data) {
    // eslint-disable-next-line
    switch (data.type) {
        case "offer":
            peerConn.setRemoteDescription(data.offer)
            createAndSendAnswer()
            break
        case "candidate":
            peerConn.addIceCandidate(data.candidate)
    }
}

function createAndSendAnswer () {
    peerConn.createAnswer((answer) => {
        peerConn.setLocalDescription(answer)
        sendData({
            type: "send_answer",
            answer: answer
        })
    }, error => {
        console.log(error)
    })
}
function sendData(data) {
    data.username = username
    webSocket.send(JSON.stringify(data))
}
let localStream
let peerConn
let username
let videoSender;
function joinCall() {

    username = document.getElementById("username-input").value

    document.getElementById("video-call-div")
    .style.display = "inline";

    navigator.mediaDevices.getUserMedia({
        video: {
            frameRate: 24,
            width: {
                min: 480, ideal: 720, max: 1280
            },
            aspectRatio: 1.33333
        },
        audio: true
    }, (stream) => {

        localStream = stream
        document.getElementById("local-video").srcObject = localStream

        let configuration = {
            iceServers: [
                {
                    "urls": ["stun:stun.l.google.com:19302", 
                    "stun:stun1.l.google.com:19302", 
                    "stun:stun2.l.google.com:19302"]
                }
            ]
        }

        peerConn = new RTCPeerConnection(configuration)
        peerConn.addStream(localStream)

        peerConn.onaddstream = (e) => {
           
            document.getElementById("remote-video").srcObject = e.stream
        }

        peerConn.onicecandidate = ((e) => {
            if (e.candidate == null)
                return
            
            sendData({
                type: "send_candidate",
                candidate: e.candidate
            })
        })

        sendData({
            type: "join_call"
        })

    }, (error) => {
        console.log(error)
    })
}


// share screen
let isShared=false;
const sharScreen=async ()=>{
    isShared= !isShared    
    var screenVideoTrack=null;
    if(isShared){
        document.getElementById('shareScreen').style.backgroundColor="grey";
        let screenStream= await navigator.mediaDevices.getDisplayMedia({
            video: true
        });
        screenVideoTrack= screenStream.getVideoTracks()[0];
        
        let sender=peerConn.getSenders().find((s) => s.track.kind === screenVideoTrack.kind)
        document.getElementById("local-video").srcObject = screenStream
        sender.replaceTrack(screenVideoTrack);
    } 
    else {
        document.getElementById('shareScreen').style.backgroundColor="rgb(206, 9, 9)";
        videoSender=localStream.getVideoTracks()[0];
        let sender=peerConn.getSenders().find((s) =>  s.track.kind === videoSender.kind)
        document.getElementById("local-video").srcObject = localStream
        sender.replaceTrack(videoSender)
    }
}


let isAudio = true
function muteAudio() {
    isAudio = !isAudio
    if(!isAudio){
        document.getElementById('muteaudio').style.backgroundColor="grey";
    }
    else{
        document.getElementById('muteaudio').style.backgroundColor="rgb(206, 9, 9)";
    }
    localStream.getAudioTracks()[0].enabled = isAudio
}

let isVideo = true
function muteVideo() {
    isVideo = !isVideo
    if(!isVideo){
        document.getElementById('mutevideo').style.backgroundColor="grey";
    }
    else{
        document.getElementById('mutevideo').style.backgroundColor="rgb(206, 9, 9)";
    }
    localStream.getVideoTracks()[0].enabled = isVideo
}
let navigate=useNavigate();
const handleLeave=()=>{
    if(peerConn) peerConn.close();
    webSocket.close();
    localStream.getTracks().forEach(function(track) {
        if (track.readyState === 'live') {
            track.stop();
        }
    });
    navigate('/');
}
const handleCompiler=()=>{
    navigate('/compiler');
}



  return (
    <div>
        <Navbar/>
        { localStorage.getItem('token') ? <div className="outer-sec">
          <div className="container w-25" style={{marginTop: "80px"}}>
            <h3>Join meet using unique key</h3>
            <i>Join the meet with specific key. </i>{'\n'}
            <i>Contact host for key of meet </i>
            <input placeholder="Enter key of meet"
                    type="text"
                    id="username-input" className='my-3'/>
            <button onClick={joinCall} className='btn btn-primary my-2'>Join Call</button>
        </div>
      <div id="video-call-div">
            <video muted id="local-video" autoPlay></video>
            <video id="remote-video" autoPlay></video>
            <div className="call-action-div">
            <i className="fa-solid fa-video-slash icon-prop" id="mutevideo" onClick={muteVideo}></i>
            <i className="fa-solid fa-microphone-slash icon-prop" id="muteaudio" onClick={muteAudio}></i>
            <i className="fa-solid fa-phone-slash icon-prop" onClick={handleLeave}></i>
            
            <i className="fa-solid fa-display icon-prop" onClick={sharScreen} id = 'shareScreen'></i>
            <i className="fa-solid fa-code icon-prop" onClick={handleCompiler} id='Compiler'></i> 
            </div>
        </div>
        </div> : <div className="loginfirst">
            <h2> you are not loged in</h2>
            <button className='btn btn-primary' onClick={()=>{
                navigate('/login');
            }}>Log in</button>
        </div>
        }
    </div>
  )
}

export default Receiver
