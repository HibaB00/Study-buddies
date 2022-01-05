import './Rooms.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faUserPlus} from '@fortawesome/free-solid-svg-icons'
import Popup from '../components/Popup';
import {useState, useEffect} from 'react'
import { useHistory } from "react-router-dom"
import {BeatLoader} from 'react-spinners'
import Loading from '../components/Loading'


function Rooms() {
  
    const [toggleState, setToggleState] = useState(1);
    const history = useHistory()

  const [buttonPopup, setButtonPopup] = useState(false);
  const [user, setUser] = useState({
      username: ''
  });

  const toggleTab = (index) =>{
      setToggleState(index)
  }

  const [rooms, setRooms] = useState([])
  const [publicRooms, setPublicRooms] = useState([])

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

    useEffect (() =>{
        async function getPublicRooms(){
            try{
                let res = await fetch ('http://localhost:5000/posts/getPublicRooms',{
                    method: 'GET'
                })
                let data = await res.json();
                const newRooms = data;
                setPublicRooms(newRooms)

            }catch(err){

            }
        }
        getPublicRooms()
    })


function goToRoom(roomId){
    history.push("/"+roomId)
}

  return (
    <div className="rooms-container">
        <div className="rooms-navbar">
            <div className="rooms-list">
                <div className= {toggleState === 1 ? "active-room": "rooms"} id='private' onClick={() => toggleTab(1)}>Your Rooms</div>
                <div className={toggleState === 2 ? "active-room": "rooms"} id='public' onClick={() => toggleTab(2)}>Public Rooms</div>
            </div>
        </div>
        {toggleState === 1 ? 
        <div className="rooms-list">
            <div className="create-room">
                <button className="create-room-btn" onClick={() => setButtonPopup(true)}><FontAwesomeIcon icon={faPlusCircle} /></button>
            </div>
            { rooms.length !== 0 ? rooms.rooms.map((room) => 
                <div className="your-rooms" onClick={() => goToRoom(room._id)}>
                    <img src={room.roomImageType} className="roomImg"/>
                    <p className="roomName">{room.title}</p>
                </div>
            ): <Loading/>}
            <Popup trigger={buttonPopup} setTrigger={setButtonPopup} />
        </div> 
        : <div className="rooms-list">
            { publicRooms.length !== 0 ? publicRooms.publicRooms.map((room) => 
                <div className="your-rooms" onClick={() => goToRoom(room._id)}>
                    <img src={room.roomImageType} className="roomImg"/>
                    <p className="roomName">{room.title}</p>
                </div>
            ): <Loading/>}
        </div> }
    </div>

  );
}

export default Rooms;