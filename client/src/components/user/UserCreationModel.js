import Modal from 'react-bootstrap/Modal'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import React, { useState,useEffect } from 'react';
import Login from './Login';

import styles from '../../css/user/model.css'

import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

function UserCreationModel(props) {
    const [lgShow, setLgShow] = useState(false);
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [team,setTeam] = useState("");

    useEffect(() => {
        setLgShow(props.setModel)
      }, []);

    const handleCreateUser = (event) => {
        
        var params = {
            'name':name,
            'email':email,
            'team':team
        }
        axios.post("/api/users/create", params)
        .then(response =>{
            response = response.data;
            toast.success(response.message);    
            setLgShow(false)
        })
        .catch(error => {
            if(error.response) {
                if(error.response.data) {
                    toast.error(error.response.data.message);
                } else{
                    toast.error(JSON.stringify(error.response));
                }
            } else {
                toast.error("User creation failed");
            }
        })

        event.preventDefault();
    } 

    const handleName = (event) =>{
        setName(event.target.value)
    }

    const handleEmail = (event) =>{
        setEmail( event.target.value)
    }
    const handleTeam = (event) =>{
        setTeam(event.target.value)
    }


    if(!lgShow) {
          return <Login/>
      } else {
    
    return (
      <>       
        <Modal
          size="lg"
          show={lgShow}
          onHide={() => setLgShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg" > 
             <p className="model-title-p"> Create User</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <form onSubmit={handleCreateUser} className="user-input-details">
              <div className="name-input-div">
                <label> Name: </label>
                <input type= "text" className="model-input-name" value={name} onChange={handleName}></input>
                  </div> 
                  <div className="email-input-div">
                <label> E-mail: </label>
                <input type= "email" className="model-input-email"  value={email} onChange={handleEmail}></input>
                  </div> 
                  <div className="team-input-div">
                <label> Team: </label>
                <input type= "text" className="model-input-team"   value ={team} onChange={handleTeam}></input>
                </div>
                <div className="submit-button-div">
                
                <input type= "submit" className="model-input-submit" value="Create"></input>
                </div>
                
                </form>

          </Modal.Body>
        </Modal>
      </>
    );
    }
}
  
//  render(<Example />);
export default UserCreationModel;