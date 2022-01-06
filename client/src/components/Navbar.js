import React, { useEffect, useState } from 'react'
import logo from '../images/logo.png'
import './Navbar.css'
import Logout from './Logout';
import jwt_decode from "jwt-decode";
import ProfileImg from '../images/icon.png'

function Navbar() { 
    const [buttonPopup, setButtonPopup] = useState(false);
    const [username,setUsername] = useState('');

    useEffect(() => {
        async function getUser()
        {
            try{
                let res = await fetch('http://localhost:5000/posts/checkUser', {
                method: 'POST',
                headers: {
                    "Access-Control-Allow-Origin" : "*", 
                    "Access-Control-Allow-Credentials" : true,
                    "mode": "cors",
                    'Token': localStorage.getItem('token')
                    }
                });
                let data = await res.json();
                setUsername(data.user.username);
                localStorage.setItem('username', data.user.username)
            }catch(error){
                console.log({error: error.message})
            }
        }
        getUser();
    }, []);
    
    return (
            <nav className="navbar-container">
                <div className="navbar-logo">
                    <a href="/"><img src={logo} /></a>
                </div>
                <ul className="navbar-list">
                    <li><a href="/">Home</a></li>
                    {localStorage.length === 0 ? <li><a href="/signup">Rooms</a></li> : <li><a href="/rooms">Rooms</a></li>}
                    {username ? <li onClick={() => setButtonPopup(true)}><a>{username}</a></li> : <li><a href="/signup">SignUp</a></li>}
                    <Logout trigger={buttonPopup} setTrigger={setButtonPopup} />
                </ul>
        </nav>
            
    )

}

export default Navbar;
