import React, { Component } from 'react'
import axios from 'axios'
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChangesetInfoModel from './ChangesetInfoModel';
import Commit from './Commit';
toast.configure();

export class Changesets extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            changeSetDetails : [] ,
            selectedCommitId:null,
            loading : false,
            commitInfo:null
        }
    }

    handleCommit = (event) =>{
        this.setState({
            ...this.state,
            selectedCommitId:event.target.id
        })
       /*  axios.get(`/api/branch/getchangesetinfo?userId=1&branchId=${branchInfo.branchId}&changesetId=${event.target.id}`)
        .then(res => {
        this.setState({
            ...this.state,
            commitInfo: res.data.data,
            })
        }).catch(err => {
            toast.error("Error while fetching changeset info");
        })  */   
    }
    
 
    render() {
        if(this.props.changesetInfo.length > 0) {
            return (
                <>
                <div className="changesetDetails">
                    <p className="changeset-details-title">Commits Made on {this.props.branchInfo.branchName}</p>
                    <div className="commits">
                    {
                    this.props.changesetInfo.map(changeset => 
                        <div className="commit"  key={changeset.id}  >
                        <div className="commit-decription" id= {changeset.id} onClick={this.handleCommit}> {changeset.description} </div>    
                        <div className="commit-created"> {changeset.createdAt} </div>    
                        <div className="commit-made-by"> {changeset.email} </div>                
                        </div>
                    )
                    }
                   {/*  </div>
                    {(this.state.commitInfo)?(<CommitInfoModel commitInfo={this.state.commitInfo}/>):null}
                    </div> */}
                     </div>
                    {(this.state.selectedCommitId)?(<ChangesetInfoModel branchId={this.props.branchInfo.branchId} changesetId={this.state.selectedCommitId}/>):null}
                    </div> 

                    <Commit  branchInfo = {this.props.branchInfo}  userId={1} />
                    </>
                )
                
        }  else  if(this.props.changesetInfo.length == 0){
            return (
                <>
                <div className="changesetDetails">
                   <div className="no-data">No commits has been made</div> 
                </div>
                <Commit  branchInfo={this.props.branchInfo}  userId={1} />
                </>
            )
        }
    }
}

export default Changesets

  /*  componentDidUpdate(prevProps) {
        if(!prevProps || (prevProps.branchId !=  this.props.branchId )) {
            this.setState({
                loading:true
            })
             setTimeout(() => {},2000)
            axios.get(`/api/branch/getallchangesets?userId=1&branchId=${this.props.branchId}`)
        .then(res => {
            
            this.setState({
                loading: false,
                changeSetDetails: res.data.data,
                })
                console.log(res.data.data)
        }
            )
        .catch(err => {
            this.setState({
                loading: false
                })
            console.log(err);
        })   
        }
    } */

   /*   componentDidMount(){
         if(! this.state.loading)
            this.setState({
                loading:true
            })
         axios.get(`/api/branch/getallchangesets?userId=1&branchId=${this.props.branchId}`)
        .then(res => {
            
            this.setState({
                loading: false,
                changeSetDetails: res.data.data,
                })
                console.log(res)
        }
            )
        .catch(err => {
            this.setState({
                loading: false
                })
            console.log(err);
        })     
    } */


     /*  if(this.state.loading) {
           return ( <div className="loadingMessage">
                <p className="loadingContent">
                    Fetching Data ....
                </p>
            </div>
            )
        } else if(this.state.changeSetDetails.length == 0) {
            return (
                <div className="changesetDetails">
                   <p>Choose Branch to load commit details</p>
                    
                </div>
            )
    
        } else {
        return (
            <div className="changesetDetails">
                <p className="changeSetDetails-title">Commits Made on {this.props.branchName}</p>
                
            </div>
        )
        } */