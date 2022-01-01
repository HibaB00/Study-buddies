import './Rooms.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import Popup from '../components/Popup';
import {useState, useEffect} from 'react'

function Rooms() {
  const [buttonPopup, setButtonPopup] = useState(false);
  const [user, setUser] = useState({
      username: ''
  });

  const [rooms, setRooms] = useState([])

  useEffect(() => {
    async function getRooms()
    {
        const newUsername = {...user, username: localStorage.getItem('username')}
        setUser(newUsername);
        const body = newUsername;
        try{
            let res = await fetch('http://localhost:5000/posts/getRooms', {
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin" : "*", 
                "Access-Control-Allow-Credentials" : true,
                "mode": "cors",
                "Content-type": "application/json"
                },
                body:JSON.stringify(body)
            });
            let data = await res.json();
            const newRooms = data;
            setRooms(newRooms)
        }catch(error){
            console.log({error: error.message})
        }
    }
    getRooms();
}, []);

async function displayRooms(){
    
    const roomDisplay = await rooms.rooms.map((room) => 
        <div className="your-rooms">
                <img src={room.roomImageType} className="roomImg"/>
                <p className="roomName">{room.title}</p>
        </div>)
}

  return (
    <div className="rooms-container">
        <div className="rooms-navbar">
            <ul className="rooms-list">
                <li><a href="/rooms" className="rooms-private" id='private'>Your Rooms</a></li>
                <li><a href="/roomspublic" className="rooms-public">Public Rooms</a></li>
            </ul>
        </div>
        <div className="rooms-list">
            <div className="create-room">
                <button className="create-room-btn" onClick={() => setButtonPopup(true)}><FontAwesomeIcon icon={faPlusCircle} /> Create a room</button>
            </div>
            { rooms.length !=0 ? rooms.rooms.map((room) => 
                <div className="your-rooms">
                    <img src={room.roomImageType} className="roomImg"/>
                    <p className="roomName">{room.title}</p>
                </div>
            ): <></>}
            
        </div>
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup} /> 

    </div>

  );
}

export default Rooms;