import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import userStore from '../../stores/userStore';
import styles from '../../css/branch/branch.css'

import 'react-toastify/dist/ReactToastify.css';
import Changesets from './Changesets';
toast.configure();

export const BranchContext  =  React.createContext();
export class BranchList extends Component {

   constructor(props) {
        super(props)
    
        this.state = {
             branches:[],
             selectedBranch:null,
             selectedBranchName:null,
             loading: false,
             changeSetDetails:[],
             errorMsg:'',
             Subscribed_userInfo:null
        }
    }

    showCheckinDetails = (event) =>{
       

        this.setState({
            selectedBranch:event.target.id,
            selectedBranchName: event.target.textContent,
            changeSetDetails:[],
            loading:true
        })

        
        axios.get(`/api/branch/getallchangesets?userId=${this.props.userDetails.id}&branchId=${event.target.id}`)
        .then(res => {
            
            this.setState({
                loading: false,
                changeSetDetails: res.data.data,
                })
        } )
        .catch(err => {
            this.setState({
                loading: false
                })
            console.log(err);
        })     

    }
    componentDidMount() {

       /*  userStore.subscribe(()=>{
                    
        console.log("user details inside subscribe::");
        console.log(userStore.getState().userInfo);

            this.setState({
                Subscribed_userInfo:userStore.getState().userInfo})
            });  */

  /*       console.log("user details::");
        console.log(this.props.userDetails);

        console.log(this.state.Subscribed_userInfo);
        var userInfo = this.props.userDetails; */

        axios.get("/api/branch/getbrancheslist?userId="+this.props.userDetails.id)
        .then(response => {
			response = response.data;
			if(response.status == "success" && response.data) {
				this.setState({
					branches:response.data
				})
			}
        })
        .catch(error => {
            toast.error( error.message + ' while getting branch list',{autoClose:3000})
            this.setState(
                {errorMsg:error.message + ' while getting branch list',
                branches:[]
            })
        });


    }
    
	
    render() {
		const {branches,errorMsg} = this.state;
        return (
            <div >
                <div className="branchDetails">
            <p className="branch-list-title">Branches</p>
            {
                branches.length?
                branches.map(branch => <div className={`branch-title${Number(this.state.selectedBranch) === branch.id? ' active':''}`}  key={branch.id} id={branch.id} onClick={this.showCheckinDetails}> {branch.name}</div>): null
            }

            </div>
{/* 
            {(this.state.loading ) ? <div className="loading">Fetching Commits </div> : null}
 */}            
            {(!this.state.selectedBranch)?  <div className="branch-select-info" > Select branch to get commits</div>: 
            /* (<Changesets  changesetInfo={this.state.changeSetDetails} branchInfo={{branchName: this.state.selectedBranchName, branchId:this.state.selectedBranch}}  /> )
             */
            (<BranchContext.Provider value={{branchName: this.state.selectedBranchName, branchId:this.state.selectedBranch}}>
                  <Changesets  changesetInfo={this.state.changeSetDetails}  branchInfo={{branchName: this.state.selectedBranchName, branchId:this.state.selectedBranch}}  /> 
            </BranchContext.Provider>
          
            )
            
            }
            
            </div>
            
        )
       
    }
}
const MapStateToProps = (state) => {
    console.log("MapStateToProps");
    console.log(state);
    return {
      userDetails: state.userInfo
    }
};


/* const MapDispatchToProps = (dispatch) => {
return {
    updateUserInfo: (userInfo)=> dispatch(updateUserInfo(userInfo))
}
}; */
export default connect(MapStateToProps, {})(BranchList);
//export default BranchList
