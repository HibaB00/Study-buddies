import React, { useState } from 'react'
import './Logout.css'
import { useHistory } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'


function Logout(props) {
    const history = useHistory()

    async function Logout(){
        localStorage.clear();
        window.location.href = '/'
    }

    return (props.trigger) ? (
        <div className="logout">
            <button onClick={Logout} className="logout-btn">Logout</button><br></br>
            <button className="close-btn" onClick={() => props.setTrigger(false)}><FontAwesomeIcon icon={ faArrowRight} /></button>
        </div>
    ) : "";
}

export default Logout