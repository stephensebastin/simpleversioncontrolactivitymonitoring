import Modal from 'react-bootstrap/Modal'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import React, { useState,useEffect, useContext } from 'react';

import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BranchContext } from './BranchList';
import styles from '../../css/user/model.css'

toast.configure();

function PullRequestInfoModel(props) {
    
    const [lgShow, setLgShow] = useState(false);
    const [prInfo,setPrInfo] = useState(null);

    const branchInfo = useContext(BranchContext);

    useEffect(() => {

      axios.get(`/api/branch/getpullrequest?userId=1&prId=${props.prId}`)
      .then(res => {
          setPrInfo(res.data.data);
          setLgShow(true);
      }).catch(err => {
          toast.error("Error while fetching Pull Request Info");
      }) 

      }, [props]); //check for second time

     const handleHideModel = () =>{
       setLgShow(false);
       props.onCloseModel();
       setPrInfo(null);
      }
    const handleDeletePR = ()=>{
    
      axios.delete(`/api/branch/delete/pullrequest?userId=1&prId=`+props.prId)
      .then(res => {

        if(res.data.status === 'success') {
          toast.success(res.data.message);
        } else {
        toast.warning(res.data.message);
        }
          setLgShow(false);

          setPrInfo(null);
          props.onCloseModel();

      }).catch(err => {
          toast.error("Error while deleting Pull Request Info");
      }) 
      
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
             <p className="model-title-p"> Pull Request Info</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
       
          {(prInfo != null)?      
           
            ( <><div className="prDetailedInfo"> <div>  <b> {prInfo.description} </b></div>
            <div>
            Date: <b> {prInfo.createdAt}</b>
            </div>
            <div>
            By   <b>{prInfo.user.email}</b>
            </div>
            <div>
            On  <b>{prInfo.branch.name}</b>
            </div>
            <div className="pr-commit-info">
            <p className="pr-commit-info-title">Commit Details:</p> 
              <div className="pr-commit-description">{prInfo.changeset.description} </div>
              <div className="pr-commit-created">  Commit Created on :   {prInfo.changeset.createdAt}         </div>
                      </div>

            </div>
            <div className="deletePR">
                <button  className="deletePRButton" value ="Delete" onClick={handleDeletePR}>Remove</button>
              </div> 
              </>
              ):null

           
          }
              
          </Modal.Body>
        </Modal>
      </>
    );
  }

  
//  render(<Example />);
export default PullRequestInfoModel;