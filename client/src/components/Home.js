import React, { Component } from 'react'
import BranchList from './branch/BranchList'
import ShowError from './common/ShowError'
import ListUsers, { UserInfo } from './user/UserInfo'

import {UserConsumer} from './context/UserContext'
import PullRequest from './branch/PullRequest'
export class Home extends Component {
	
	static contextType =  UserConsumer;

    render() {
		
        return (
			< >
				
				<BranchList /* userId = {this.context.id} *//>
				<PullRequest /* userId = {this.context.userInfo.id} *//>
					
					{/* <UserConsumer>
						{userinfo => 					
					<BranchList userId = {userinfo.id}/* userId={this.props.userId}  *//*/>
				}			</UserConsumer> */}
{/* 				<div className="userDetails">
				<UserInfo userId={this.props.userId}/>
				</div> */}
			</>
        )
    }
}

export default Home
