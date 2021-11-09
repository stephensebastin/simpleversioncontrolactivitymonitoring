import React,{useState,useEffect} from 'react'

import axios from 'axios'
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../css/branch/pullrequest.css'
import {connect} from 'react-redux';

import PullRequestInfoModel from './PullRequestInfoModel';
toast.configure();



function PullRequest(props) {
    const [prInfo, setPrInfo] = useState(null);
    const [selectedPrId, setselectedPrId] = useState(null);

    useEffect(() => {

        axios.get("/api/branch/getpullrequests?userId="+props.userDetails.id)
        .then(response => {
			response = response.data;
			if(response.status == "success" && response.data) {
				setPrInfo(response.data)
                /* console.log(response.data); */
			}
        })
        .catch(error => {
            toast.error( error.message + ' while getting pull requests',{autoClose:3000})
            setPrInfo(
                {
                prInfo:null
            })
        });

    },[]);

   const handleOnClose = () =>{
        setselectedPrId(null);
        axios.get("/api/branch/getpullrequests?userId="+props.userDetails.id)
        .then(response => {
			response = response.data;
			if(response.status == "success" && response.data) {
				setPrInfo(response.data)
                /* console.log(response.data); */
			}
        })
        .catch(error => {
            toast.error( error.message + ' while getting pull requests',{autoClose:3000})
            setPrInfo(
                {
                prInfo:null
            })
        });

    }

    const handleCommit = (event) =>{
        setselectedPrId(event.target.id);
    }
    return (
        <div className="prInfoDiv">
            <p className="prInfoTitle"> Pull Reuqests</p>
            <div className="prInfo">
                
            { prInfo && prInfo.length>0 ? prInfo.map(pr => 
                <div className="pr">
                        <div className="pr-description" id={pr.id} onClick={handleCommit}>{pr.description}</div>
                        <div className="pr-created">Created on {pr.createdAt}</div>
                        <div className="pr-made-by">By {pr.user.email}</div>
                        <div className="pr-made-on">On {pr.branch.name}</div>

                </div>): null} 

            {(prInfo && prInfo.length == 0)? <div className="no-data">No Pull Requests has been made</div> : null}  

            {(selectedPrId)?(<PullRequestInfoModel prId={selectedPrId} onCloseModel={handleOnClose}/>):null}
                </div>    
        </div>
    )
}


const MapStateToProps = (state) => {
    console.log("MapStateToProps");
    console.log(state);
    return {
      userDetails: state.userInfo
    }
};

export default connect(MapStateToProps, {})(PullRequest);

//export default PullRequest
