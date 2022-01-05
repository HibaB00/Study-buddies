import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom';
import Chat from '../components/Chat';
import {io} from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import './Room.css'
const socket = io('http://localhost:5000')

function Room() { 

    const [room, setRoom] = useState([])
    const [roomId, setRoomId] = useState("")
    const [buttonPopup, setButtonPopup] = useState(true);
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
                const newRoom = data
                setRoom(newRoom)
                const newRoomId = data.room._id
                socket.emit('join_room', newRoomId)
                setRoomId(newRoomId)
            }catch(err){

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
    }, [socket]);

    return (
          <div className="main-room">
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
              
            
          </div>
    )

}

export default Room;