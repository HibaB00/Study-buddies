import './App.css';
import Home from './pages/Home'
import Navbar from './components/Navbar'
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Rooms from './pages/Rooms'
import Profile from './pages/Profile';
import Room from './pages/Room';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/signin" exact component={SignIn} />
          <Route path="/rooms" exact component={Rooms} />
          <Route path="/profile" exact component={Profile} />
          <Route path="/:roomID" exact component={Room} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
