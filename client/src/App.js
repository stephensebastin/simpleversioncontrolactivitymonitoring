import logo from './logo.svg';
//import './App.css';
import Home from './components/Home';
import UserInfo from './components/user/UserInfo';
import Login from './components/user/Login';
import SimpleModel from './components/user/SimpleModel';
import UserCreationModel from './components/user/UserCreationModel';
import NavBar from './components/common/NavBar';

function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
{/* {        <Home></Home>}
      */}
       <Login></Login>
      {/*  <SimpleModel></SimpleModel> */}
 {  
}    </div>
  );
}

export default App;
