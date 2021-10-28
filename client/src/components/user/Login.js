import React, { Component } from 'react'
import axios from 'axios'
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from '../Home';
import UserCreationModel from './UserCreationModel';
import styles from '../../css/user/user.css'

toast.configure();

class Login extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            email : '',
            userinfo : {},
            showModel:false
        }
    }
    
    handleSubmit = event => {
        if(this.state.email.length ==0) {
            toast.error(  'Email should not be empty',{autoClose:3000})
        } else {
        axios.get("/api/users/getInfo?email="+(this.state.email))
        .then(response => {
			response = response.data;
			if(response.status == "success" && response.data) {
                toast.success("Successfully Loggedin",{autoClose:5000})
				this.setState({
					userinfo: response.data
				})
			} else {
                toast.error(response.message,{autoClose:5000})
				this.setState({
					userinfo: {}
				})
            }
        })
        .catch(error => {
            if(error.response) {
                if(error.response.data) {
                    toast.error( error.response.data.message ,{autoClose:5000})
                } else{
                    toast.error( JSON.stringify(error.response.data) ,{autoClose:5000})
                }

            } else{
                toast.error( error.message ,{autoClose:5000})
            }
            this.setState(
                {userinfo:{} })
        });
    }
       event.preventDefault() //after submit the value will be reset to avoid this we are using ethis event preventDefault just avoidng  default events
    }

       handleEmailInputChange = (event)=> {
        this.setState({
            email:event.target.value
        })
     }

     handleCreateUserButton = async () => {
       await this.setState(
            {
            showModel:true
        })
     }


    render() {
        if(this.state.userinfo && this.state.userinfo.id != undefined){
            return (
                <div className="dashboard">
                      <Home userId = {this.state.userinfo.id}/>
                </div>
              )
        } else if( this.state.showModel) {
           
           return  <UserCreationModel setModel={this.state.showModel}> </UserCreationModel>
        }
        else {
        return (
            <div className="user-login-div">
                <div className="create-user-div">
                    <input type="button" value ="Create User" className="create-user-button" onClick={this.handleCreateUserButton}/>
                </div>
                <form onSubmit={this.handleSubmit}>
                <div className="login-div">
                    <label>Enter your E-mail: </label>
                    <input className="input-email" placeholder="abc@abc.com" type="email" name="email" value={this.state.email} onChange={this.handleEmailInputChange}></input>
                    <input type="submit" value="Proceed" className="submitButton"></input>
                </div>
                </form>
            </div>
            )
        }
    }
}

export default Login
