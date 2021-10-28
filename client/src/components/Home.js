import React, { Component } from 'react'
import BranchList from './branch/BranchList'
import ShowError from './common/ShowError'
import ListUsers, { UserInfo } from './user/UserInfo'

export class Home extends Component {
	
	
    render() {
		
        return (
			<div >
					
					<BranchList userId={this.props.userId} />
				
{/* 				<div className="userDetails">
				<UserInfo userId={this.props.userId}/>
				</div> */}
			</div>
        )
    }
}

export default Home
