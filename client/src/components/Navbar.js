import React, { useEffect, useState } from 'react'
import logo from '../images/logo.png'
import './Navbar.css'
import jwt_decode from "jwt-decode";
import ProfileImg from '../images/icon.png'

function Navbar() { 
    
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
                    <li><a href="/rooms">Rooms</a></li>
                    {username ? <li><a href="/profile">{username}</a></li> : <li><a href="/signup">SignUp</a></li>}
                </ul>
        </nav>
            
    )

}

export default Navbar;
