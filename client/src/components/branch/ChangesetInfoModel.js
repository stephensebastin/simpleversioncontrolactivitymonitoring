import Modal from 'react-bootstrap/Modal'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import React, { useState,useEffect, useContext, useRef } from 'react';

import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BranchContext } from './BranchList';
import prstyles from '../../css/branch/pullrequest.css'

import styles from '../../css/user/model.css'

toast.configure();

function ChangesetInfoModel(props) {
    
    const [lgShow, setLgShow] = useState(false);
    const [commitInfo,setCommitInfo] = useState(null);
    const [showPR, setshowPR] = useState(false);
    const branchInfo = useContext(BranchContext);
    const prDescContent = useRef(null);


    useEffect(() => {
      console.log("getting value from context:: "+branchInfo.branchId);
      axios.get(`/api/branch/getchangesetinfo?userId=1&branchId=${branchInfo.branchId}&changesetId=${props.changesetId}`)
      .then(res => {
      /* this.setState({
          ...this.state,
          commitInfo: res.data.data,
          }) */
          setCommitInfo(res.data.data);
          setLgShow(true);
      }).catch(err => {
          toast.error("Error while fetching changeset info");
      }) 

      }, [props]); //check for second time

     const handleHideModel = () =>{
       setLgShow(false);
       props.onCloseModel();
       setCommitInfo(null);
      }

      const showPRInput = () =>{
        setshowPR(true);
      }
    
      const handleCreatePR = () => {

         // setshowPR(false);
          if(prDescContent.current.value.trim().length == 0 ) {
            toast.error("Enter pull request description");
          } else {
          var params = {            
            'branchId':commitInfo.branchId,
            'changesetId':commitInfo.id,
            'description': prDescContent.current.value,
            'userId':1 //change with redux
        }
        axios.post("/api/branch/createpullrequest", params)
        .then(response =>{
            response = response.data;
            toast.success(response.message);   
            setshowPR(false);
        })
        .catch(error => {
            if(error.response) {
                if(error.response.data) {
                    toast.error(error.response.data.message);
                } else{
                    toast.error(JSON.stringify(error.response));
                }
            } else {
                toast.error("Pull Request Creation Failed.");
            }
        });
      }

      }

    return (
      <>       
        <Modal
          size="lg"
          show={lgShow}
          onHide={handleHideModel}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg" > 
             <p className="model-title-p"> Commit Info</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
       
          {(commitInfo != null)?      
           
            ( <div className="changesetInfo"> 
              <div> Commit : {commitInfo.description} </div>
            <div>
            Date:  {commitInfo.createdAt}
            </div>
            <div>
            By  {JSON.stringify(commitInfo.user_id)}
            </div>
            <div>
            <p>Commit Details:</p> {commitInfo.changesetDetails.map(changes => 
              <div className="file-changes"> <p className="changed-file">file : {changes.filename}</p><div className="line-changes">
                {(changes.addition!= null)? <div className="line-changes-addition"> Added Lines: {JSON.stringify(changes.addition)}</div> : null}
                {(changes.deletion!= null)? <div className="line-changes-deletion"> Deleted Lines: {JSON.stringify(changes.deletion)}</div> : null}
                {(changes.changes!= null)? <div className="line-changes-update"> Modified Lines: {JSON.stringify(changes.changes)}</div> : null}
              </div>
              </div>  
              )} 
            </div>            
              <div className="createPR">
                <div className="prButtonDiv"><input type="button" className="showPRButton" value="Create PR" onClick={showPRInput}>
                </input></div>
                {(showPR)?
                <div className="prInputs">
                    <label>Description : </label> <input type="text" className="pr-input-description" ref={prDescContent}></input> 
                    <input type="submit" value="Submit" className="pr-submit-button" onClick={handleCreatePR}></input>
                </div>
              :null}
              </div>
            </div>
              ):null
          }
              
          </Modal.Body>
        </Modal>
      </>
    );
  }

  
//  render(<Example />);
export default ChangesetInfoModel;