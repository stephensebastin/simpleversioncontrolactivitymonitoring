//import logo from './logo.svg';
//import './App.css';
import Home from './components/Home';
import UserInfo from './components/user/UserInfo';
import Login from './components/user/Login';
import SimpleModel from './components/user/SimpleModel';
import UserCreationModel from './components/user/UserCreationModel';
import NavBar from './components/common/NavBar';
import {Provider} from 'react-redux';
import userStore from './stores/userStore'


function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
          <Provider store = {userStore}>
       <Login></Login>
       </Provider>
        </div>
  );
}

export default App;
