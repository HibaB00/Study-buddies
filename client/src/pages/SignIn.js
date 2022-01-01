import './SignIn.css';
import { useState } from 'react'
import SigninImg from '../images/SigninImg.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

function SignIn() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function loginUser(e){
    e.preventDefault();
    try{
      let res = await fetch('http://localhost:5000/posts/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin" : "*", 
          "Access-Control-Allow-Credentials" : true,
          "mode": "cors"
        },
        body: JSON.stringify({
          email,
          password
        })
      })
      let data = await res.json();
      console.log(data);
  
      if(data.user){
        localStorage.setItem('token', data.user)
        alert('Login successful')
        window.location.href = '/'
      }else{
        alert('Please check email or password')
      }
    }catch(error){
      console.log({error: error.message})
    }
    

  }

  return (
    <div className="signin-container">
      <div className="inputs-container">
          <form className="inputs" onSubmit={loginUser} >
            <h1 id="signin-title">Welcome Back !</h1>
            <input placeholder="Email" type="email"  name="email" className="inputs-sign-in" onChange={(e) => setEmail(e.target.value)}/>
            <input placeholder='Password' type="password"  name="password" className="inputs-sign-in"  onChange={(e) => setPassword(e.target.value)}/>
            <button className='signin-btn' type="submit"><FontAwesomeIcon icon={faArrowRight} /></button>
          </form>
          <a href="/signup" className="sign-in-aref">don't have an account?</a>
      </div>
      <img src={SigninImg} className="singin-img"/>
    </div>

  );
}

export default SignIn;


