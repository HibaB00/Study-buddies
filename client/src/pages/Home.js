import './Home.css';
import bottomStyle from '../images/end-style.svg'
import HomeImg from '../images/HomeImg.svg'
import { useHistory } from "react-router-dom"

function Home() {
  const history = useHistory()

  function joinRoom(){
    history.push("/rooms")
  }
  function signUp(){
    history.push("/signup")
  }
  return (
    <div className="home-container">
      <div className="home-info">
        <div className="infos">
            <h1 id='title'>Study Buddies</h1>
            <h2>join a room to be productive with buddies.</h2>
            {localStorage.length === 0 ? <button id='join-btn' onClick={signUp}>Join a room</button> : <button id='join-btn' onClick={joinRoom}>Join a room</button>}
        </div>
        <div className="main-img">
            <img src={HomeImg} />
        </div>
      </div>  
      <img className="bottom-img" src={bottomStyle} />
    </div>
  );
}

export default Home;