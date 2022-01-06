import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom';
import Chat from '../components/Chat';
import {io} from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import Loading from '../components/Loading'
import './Room.css'
const socket = io('http://localhost:5000')


function Room() { 

    const [room, setRoom] = useState([])
    // const [time, setTime] = useState(60)
    let time = 3600;
    let breakTime = 1200;

    let timer = '60:00';
    const [pomodoro, setPomodoro] = useState('60:00')
    const [showRoom, setShowRoom] = useState(false)
    const [timePomodoro, setTime] = useState(60)
    const [roomId, setRoomId] = useState("");
    const [checkAdmin, setAdmin] = useState(false);
    const [buttonPopup, setButtonPopup] = useState(true);
    const [status, setStatus] = useState('Study Time')
    const { roomID } = useParams();
    const [link, setLink] = useState('');
    const [newLink, setNewLink] = useState("https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&mute=1")


    useEffect(() => {
        async function getRoomInfo(){
            try{
                let res = await fetch (`http://localhost:5000/posts/${roomID}`,{
                    method: 'GET'
                })
                let data = await res.json();
                console.log(data)
                const newRoom = data
                setRoom(newRoom)
                const newRoomId = data.room._id
                socket.emit('join_room', newRoomId)
                setRoomId(newRoomId)
                setShowRoom(true)
            }catch(err){
                console.log(err)
            }
        }
        getRoomInfo();
    }, [roomID])

    const sendLink = async () => {
        const newLink = link.split("?v=")[1]
        setNewLink("https://www.youtube.com/embed/"+newLink+"?autoplay=1&mute=1")
        const info = {
            link: newLink,
            room: roomID
        }
        socket.emit('send_link', info)
    };

    useEffect(() => {
        socket.on("receive_link", (data) => {
          const newLink = data;
          setNewLink("https://www.youtube.com/embed/"+newLink+"?autoplay=1&mute=1")
        });
        socket.on("receive_time", (data) =>{
          const newTime = data.time;
          const newStatus = data.status;
          setPomodoro(newTime)  
          setStatus(newStatus)
        })
    }, [socket]);

    function changeTime(){

        if(time >= 0){
            setStatus("Study Time")
            const minutes = Math.floor(time/60);
            let seconds = time % 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            timer = `${minutes}:${seconds}`
            time--;
            setPomodoro(timer)
            setTime(time)
            socket.emit("send_timer", {roomId: roomID, time: timer, status: "Study Time"}) 
        }else{
            if(breakTime >= 0){
                setStatus("Break Time")
                const minutes = Math.floor(breakTime/60);
                let seconds = breakTime % 60;
                seconds = seconds < 10 ? '0' + seconds : seconds;
                timer = `${minutes}:${seconds}`
                breakTime--;
                setPomodoro(timer)
                setTime(time)
                socket.emit("send_timer", {roomId: roomID, time: timer, status: "Break Time"})
            }
        }
    }
    function onClick(){
        let input_study = document.getElementById("study_time").value = "";
        let input_break = document.getElementById("break_time").value = "";
        setInterval(changeTime, 1000)
    }

    return (
        
          <div className="main-room">
          {room.length !== 0 ? 
          <div>
            <div className="show-chat">
                <button className="show-chat-btn" onClick={() => setButtonPopup(!buttonPopup)}><FontAwesomeIcon icon={faCommentDots} /></button>
                {!buttonPopup ?<Chat socket={socket} username={localStorage.getItem('username')} room={roomId}/> : <></>}
            </div>
            <div className="youtube-video">
                <iframe width="500" height="280" className="video" src={newLink} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <input placeholder="link..." type="text"  name="link" onChange={(e) => setLink(e.target.value)} className='input-link'/>
                <button onClick={sendLink} className='send-link-btn'>&#9658;</button>
                <label id='link-invite'><FontAwesomeIcon icon={faUserPlus} /> http://localhost:3000/{roomID}</label>
            </div>
            <div className="Timer">
                <p class="status">{status}</p>
                <p className="pomodoro">{pomodoro}</p>
                {localStorage.getItem("username") === room.room.admin?
                <div>
                <button onClick={onClick} className="btn-start">Start</button><br></br>
                <div className='inputs-settings'>
                    <div>
                        <label target="studyTime">Study: </label>
                        <input type='number' onChange={(e) => time = e.target.value} name="studyTime" className='input-time' id="study_time"/>
                        <label target="studyTime"> s</label>
                    </div>
                    <div>
                        <label target="breakTime">Break: </label>
                        <input type='number' onChange={(e) => breakTime = e.target.value} name="breakTime" className='input-time' id="break_time"/>
                        <label target="breakTime"> s</label>
                    </div>
                </div>
                </div> : <></>}
            </div> 
            </div> : <Loading />}
            
          </div>
    )

    }

export default Room;