import './Home.css';
import bottomStyle from '../images/end-style.svg'
import HomeImg from '../images/HomeImg.svg'

function Home() {
  return (
    <div className="home-container">
      <div className="home-info">
        <div className="infos">
            <h1 id='title'>Study Buddies</h1>
            <h2>join a room to be productive with buddies.</h2>
            <button id='join-btn'>Join a room</button>
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