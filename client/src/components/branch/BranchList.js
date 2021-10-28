import React, { Component } from 'react'
import axios from 'axios'
import {toast} from 'react-toastify';

import styles from '../../css/branch/branch.css'

import 'react-toastify/dist/ReactToastify.css';
import Changesets from './Changesets';
toast.configure();

export class BranchList extends Component {

   constructor(props) {
        super(props)
    
        this.state = {
             branches:[],
             selectedBranch:null,
             selectedBranchName:null,
             loading: false,
             changeSetDetails:[],
             errorMsg:''
        }
    }

    showCheckinDetails = (event) =>{
       

        this.setState({selectedBranch:event.target.id,
            selectedBranchName: event.target.textContent,
            changeSetDetails:[],
            loading:true
        })

        
        axios.get(`/api/branch/getallchangesets?userId=1&branchId=${event.target.id}`)
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
        axios.get("/api/branch/getbrancheslist?userId="+this.props.userId)
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
      /*   if(errorMsg.length > 0) {
            console.log("error render");
            
                showOut =<ShowError errorMessage= {errorMsg}/>
            
        } else  if(branches.length > 0){
            showOut = <div className="branchesList">
            List of branches 
            {
                branches.length?
                branches.map(branch => <div key={branch.id} id={branch.id}> {branch.name}</div>): null
            }
            </div>;

        } */
        return (
            <div >
                <div className="branchDetails">
            <p className="branch-list-title">Branches</p>
            {
                branches.length?
                branches.map(branch => <div className="branch-title"  key={branch.id} id={branch.id} onClick={this.showCheckinDetails}> {branch.name}</div>): null
            }

            </div>
{/* 
            {(this.state.loading ) ? <div className="loading">Fetching Commits </div> : null}
 */}            
            {(!this.state.selectedBranch)?  <div className="branch-select-info" > Select branch to get commits</div>: 
            (<Changesets  changesetInfo={this.state.changeSetDetails} branchInfo={{branchName: this.state.selectedBranchName, branchId:this.state.selectedBranch}}  /> ) }
            
            </div>
            
        )
       
    }
}

export default BranchList
