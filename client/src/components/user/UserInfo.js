import React, { Component } from 'react'
import axios from 'axios'
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

export class UserInfo extends Component {
  
    constructor(props) {
        super(props)
    
        this.state = {
             user:{},
             errorMsg:''
        }
    }

    componentDidMount(){
        axios.get("/api/users/getInfo?userId="+this.props.userId)
        .then(response => {
			response = response.data;
			if(response.status == "success" && response.data) {
				this.setState({
					user:response.data,
                    errorMsg:''
				})
			}
        })
        .catch(error => {
            toast.error(error.message + " while getting user info" ,{autoClose:5000})
//            {toast.error(this.props.errorMessage,{autoClose:5000}) }
            this.setState(
                {errorMsg: error.message + " while getting user info",
                user:{}
            })
        })
    }
	
    render() {
		const {user,errorMsg} = this.state;
		  
        return (
            (errorMsg.length > 0)?null:(
            <div className="users-list">
            User Details
                <p> Name : {user.name}</p>
                <p> Email : {user.email}</p>
               { user.team? <p> Team : {user.team}</p>:null }
        </div>)

        )
    }
}

export default UserInfo
