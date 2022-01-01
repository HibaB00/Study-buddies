import React, { useState } from 'react'
import './Popup.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import FileBase from 'react-file-base64'

function Popup(props) {

    const [roomData, setRoomData] = useState ({
        title: '',
        imageRoom: '',
        admin: '',
        type: ''
    })

    async function handleSubmit(e){
        e.preventDefault();
        const newRoomData = { ...roomData, admin: localStorage.getItem('username') }
        setRoomData(newRoomData);
        const body = newRoomData;
        
        try{
            let res = await fetch('http://localhost:5000/posts/registerRoom', {
            method: 'POST',
            headers: {
              "Access-Control-Allow-Origin" : "*", 
              "Access-Control-Allow-Credentials" : true,
              "mode": "cors",
              "Content-type": "application/json"
            },
            body: JSON.stringify(body)
          });
          window.location.href = '/rooms'
        
            
        }catch(err){

        }
    }

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <button className="close-btn" onClick={() => props.setTrigger(false)}><FontAwesomeIcon icon={ faArrowRight} /></button>
                <form className='room-info' onSubmit={handleSubmit}>
                    <div className="room-img">
                        <img src={roomData.imageRoom} className='img-room-chosen' />
                    </div>
                    <div>
                        <FileBase
                            type="file"
                            multiple={false}
                            name="imageRoom"
                            onDone={({base64}) => setRoomData({ ...roomData, imageRoom: base64})}
                        />
                    </div>
                    <input placeholder="room name" className="room-name" name="title" onChange={(e) => setRoomData({ ...roomData, title: e.target.value })}/><br></br>
                    <input type="radio" className="pick-room-type" id="private" name="check" value="private" onChange={(e) => setRoomData({ ...roomData, type: e.target.value })}/>
                    <label for="private">private</label><br></br>
                    <input type="radio" className="pick-room-type" id="public" name="check" value="public" onChange={(e) => setRoomData({ ...roomData, type: e.target.value })} />
                    <label for="public">public</label><br></br>
                    <button type="submit" id="create-btn" className="btn-room-info">Create Room</button>
                </form>
            </div>
        </div>
    ) : "";
}

export default Popup
