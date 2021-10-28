import Modal from 'react-bootstrap/Modal'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import React, { useState,useEffect } from 'react';

import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from '../../css/user/model.css'

toast.configure();

function ChangesetInfoModel(props) {
    const [lgShow, setLgShow] = useState(false);
    const [commitInfo,setCommitInfo] = useState(null);

    useEffect(() => {
      axios.get(`/api/branch/getchangesetinfo?userId=1&branchId=${props.branchId}&changesetId=${props.changesetId}`)
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
       setCommitInfo(null);
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
           
            ( <div> <div> Commit : {commitInfo.description} </div>
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
              )} {/* {JSON.stringify(commitInfo.changesetDetails)} */}
            </div>            
         {/*    {JSON.stringify(commitInfo)}  */}
            </div>  ):null
          }
              
          </Modal.Body>
        </Modal>
      </>
    );
  }

  
//  render(<Example />);
export default ChangesetInfoModel;