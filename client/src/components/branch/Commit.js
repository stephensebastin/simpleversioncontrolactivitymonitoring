import React,{useState,useEffect, useRef} from 'react'

import Modal from 'react-bootstrap/Modal'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'

import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../css/branch/commit.css'

toast.configure();

function Commit(props) {
    const [showModel, setShowModel] = useState(false);
    const [addFile, setAddFile] = useState(false);
    const [updateFile, setUpdateFile] = useState(false);
    const [deleteFile, setDeleteFile] = useState(false);

    const [addFilesDetails , setAddFilesDetails] = useState([]);
    const [updateFilesDetails , setUpdateFilesDetails] = useState([]);
    const [updateFilesDetailsWithFileNameMap , setupdateFilesDetailsWithFileNameMap] = useState(null);
    const [filesList , setFilesList] = useState([]);
    const [filesToDeleteList , setFilesToDeleteList] = useState([]);

    const fileName = useRef(null);
    const fileContent = useRef(null);
    const lineNumber = useRef(null);
    const lineUpdateType = useRef(null);
    const lineChanges = useRef(null);
    const fileSelectForUpdate = useRef(null);
    const fileSelectForDelete = useRef(null);
    const commitMessageRef = useRef(null);

    const handleCreateCommit = () => {
       setShowModel(true);
    }

    const handleFileAddChanges = (event) => {
       if(fileName.current.value.trim().length == 0 ) {
            toast.error("file name should not be empty");
       } else if(fileContent.current.value.length ==0){
         toast.error("file content should not be empty");   
       } else{
        var newFileInfo = {
            filename: fileName.current.value,
            content:fileContent.current.value
        }
        let uniqueAddFilesDetails =[];
        for(const addFilesDetail of addFilesDetails) {
           
            if(addFilesDetail.filename != fileName.current.value)
               { 
                   uniqueAddFilesDetails.push(addFilesDetail);
            } else{
                toast.info("File :\""+fileName.current.value + "\" value is updated", 2000);
            }
        }
        uniqueAddFilesDetails.push(newFileInfo);
        setAddFilesDetails(uniqueAddFilesDetails);
        setAddFile(false);
        }
    }

    const handleAddFile = () => {
        if(!updateFile  && !deleteFile) {
           
        
        setAddFile(true);
        } else{
            toast.warning("Complete previous operation first", 2000)
        }
    }

    const handleModifyFile = () =>{
        if(!addFile && !deleteFile) {
      
        axios.get('/api/branch/getallfiles?userId='+props.userId+'&branchId='+props.branchInfo.branchId)
        .then(response => {
            if(response.data.status == "success" && response.data.data.length > 0 ) {
                var listOfFiles = response.data.data.map(fileInfo=> fileInfo.filename);
                setFilesList(listOfFiles);
                setUpdateFile(true);
            } else{
                toast.warning("No files found... Please add file and commit" );
            }
        })
        .catch(error => {
            toast.error(error.message);         
        });
    } else{
        toast.warning("Complete previous operation first", 2000)
    }
    }
    const handleClose = () => {
        setShowModel(false);
        //set all state to default
    } 

    const handleOnChangeUpdateOption = (event) =>{
        console.log(event.target.value)
        
    }
    

    useEffect(() => {
        setShowModel(false);
        setAddFile(false);
        setUpdateFile(false);
        setDeleteFile(false);
        setAddFilesDetails([]);
        setUpdateFilesDetails([]);
        setFilesList([]);
        setFilesToDeleteList([]);
        setupdateFilesDetailsWithFileNameMap(null);
    },[props]);

    const handleFileUpdateChanges = () =>{
        
        if(lineNumber.current.value.trim().length == 0 ) {
            toast.error("line number should not be empty");
       } else if(lineChanges.current.value.length ==0){
         toast.error("changes should not be empty");   
       } else if (fileSelectForUpdate.current.value == 'selectFile'){
         toast.error("Select file to update changes");   

       }else{
        var updateFileDetail = {
            lineNumber: lineNumber.current.value,
            lineChanges:lineChanges.current.value,
            lineUpdateType: lineUpdateType.current.value,
            fileName: fileSelectForUpdate.current.value
        }
        setUpdateFilesDetails([...updateFilesDetails, updateFileDetail]);

        if(!(updateFilesDetailsWithFileNameMap )|| (updateFilesDetailsWithFileNameMap.length == 0 ) || (updateFilesDetailsWithFileNameMap[fileSelectForUpdate.current.value]==undefined)) {
           // = {};
          //  updateObj.fileName= fileSelectForUpdate.current.value;
         
          let fileName= fileSelectForUpdate.current.value;
            let lineChangesArr =[];
            let lineChangeObj =    {};
            lineChangeObj.lineNo = lineNumber.current.value;
            let updateType = lineUpdateType.current.value;
            lineChangeObj[updateType]=lineChanges.current.value; 
            lineChangesArr.push(lineChangeObj);
            //updateObj.lineChanges =lineChangesArr;
         //   setupdateFilesDetailsWithFileNameMap(updateObj);
         let  updateObj ={} ;
         if(updateFilesDetailsWithFileNameMap != null) {
         updateObj= updateFilesDetailsWithFileNameMap; //todo render this
        }
         updateObj[fileName]= lineChangesArr;
            
            setupdateFilesDetailsWithFileNameMap(updateObj);
        }else {
                
            if(  updateFilesDetailsWithFileNameMap[fileSelectForUpdate.current.value] != undefined ) {
                
                let lineChangesArr = updateFilesDetailsWithFileNameMap[fileSelectForUpdate.current.value];
                let uniqueArr = [];
                for( const changesObj of lineChangesArr) {
                    if(changesObj.lineNo == lineNumber.current.value && changesObj[lineUpdateType.current.value]) {
                       toast.info("Value updated for File:\""+fileSelectForUpdate.current.value+"\"");
                       
                    } else {
                        uniqueArr.push(changesObj);
                    }
                }
                let lineChangeObj =    {};
                        lineChangeObj.lineNo = lineNumber.current.value;
                        let updateType = lineUpdateType.current.value;
                        lineChangeObj[updateType]=lineChanges.current.value;
                        uniqueArr.push(lineChangeObj);

                let updateFileDetailsObj = updateFilesDetailsWithFileNameMap;
                updateFileDetailsObj[fileSelectForUpdate.current.value] = uniqueArr;
                setupdateFilesDetailsWithFileNameMap(updateFileDetailsObj);
            }
           
        }

        setUpdateFile(false);
       
        }
    }
    const handleDeleteFile = () =>{
        if(!addFile && !updateFile && addFilesDetails.length ==0 && updateFilesDetails.length == 0 ) {
            axios.get('/api/branch/getallfiles?userId='+props.userId+'&branchId='+props.branchInfo.branchId)
        .then(response => {
            if(response.data.status == "success" && response.data.data.length > 0 ) {
                var listOfFilesToDelete = response.data.data.map(fileInfo=>{ return {'fileName':fileInfo.filename, 'id':fileInfo.id}});
                setFilesToDeleteList(listOfFilesToDelete);
                setDeleteFile(true);
            } else{
                toast.warning("No files found... Please add file and commit" );
            }
        })
        .catch(error => {
            toast.error(error.message);         
        });

        } else {
            toast.error("Delete operation cannot be performed with other changes.")
        }
    }

    const handleDeleteFileChanges = () =>{
      
        var params = {
            'fileName':fileSelectForDelete.current.value,
            'branchId':props.branchInfo.branchId,
            'userId':props.userId
        }
        axios.post("api/branch/file/delete", params)
        .then(response =>{
            response = response.data;
            toast.success(response.message);    
            setDeleteFile(false);
            setShowModel(false);
        })
        .catch(error => {
            if(error.response) {
                if(error.response.data) {
                    toast.error(error.response.data.message);
                } else{
                    toast.error(JSON.stringify(error.response));
                }
            } else {
                toast.error("File deletion failed");
            }
        })
    }
    const handleCommitPush = () => {
      
        if(commitMessageRef.current.value.trim().length == 0) {
            toast.error("Enter commit message to proceed");
        } else{
            var commitInfo = {}
            commitInfo.userId= props.userId;
            commitInfo.branchId= props.branchInfo.branchId;
            var commitDetails = {};
            commitDetails.commit_message=  commitMessageRef.current.value;
            let changesObj = {};
            
            if(addFilesDetails && addFilesDetails.length >0 ){
                changesObj.add =  addFilesDetails;
                console.log(addFilesDetails);               
            } else{

                changesObj.add =[]; 
            }
            let updateChangeInfo = [];
                if(updateFilesDetailsWithFileNameMap) {
                for( const fileName in updateFilesDetailsWithFileNameMap) {
                    let fileChangeObj = {}
                    fileChangeObj.filename = fileName;
                    fileChangeObj.lineChanges =updateFilesDetailsWithFileNameMap[fileName];     
                    console.log(fileChangeObj);
                    updateChangeInfo.push(fileChangeObj);
                }
                
             }
                changesObj.update=updateChangeInfo;
             
            commitDetails.changes= changesObj;
            commitDetails.timestamp = Date.now() ;
             let commitDetailsArr = []; //commits are array.
             commitDetailsArr.push(commitDetails);
            
             commitInfo.commitDetails = commitDetailsArr;
             
             axios.post('/api/push',commitInfo)
             .then(res => {
                    var response = res.data;
                    if(response.status == "success") {
                        toast.success(response.message, 3000);
                        setShowModel(false);
                        toast.info("Click "+props.branchInfo.branchName + " to refresh", 3000);

                    } else{
                        toast.error(response.message, 3000);
                    }
             })
             .catch(err => {

                 if(err.response && err.response.data){
                    toast.error(err.response.data.message, 3000);
                 } else{
                     toast.error(err.message, 3000);
                 }
             })
        }
    }

    return (
        
        <>      
          <div className='commit-create-div'>
            <input type="button" className="create-commit" value="Add New Commit" onClick={handleCreateCommit}></input>
        </div>
        {(showModel)? (

            <Modal
            size="fullscreen"
            show={showModel}
            onHide={handleClose}
            aria-labelledby="example-modal-sizes-title-lg"
            >
            <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg" > 
            <p className="model-title-p"> Create changes on branch : { props.branchInfo.branchName}</p>
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               
                  {/*   {props.branchInfo.branchId} {props.userId} */}
                  
                    <div className="button-container">
                    <div className="add-files-button-div"><input type="button" className ="add-files-button" onClick={handleAddFile} value="Add File"/></div>
                    <div className="modify-files-button-div"><input type="button" className ="modify-files-button" onClick={handleModifyFile} value="Update File"/></div>
                    <div className="delete-files-button-div"><input type="button" className ="delete-files-button" onClick={handleDeleteFile} value="Delete File"/></div>
                    </div>
                    <div className="addFileDiv">
                   
                    {(deleteFile)? ( 
                        <div className="delete-new-file">
                            <label>Choose file to delete:</label>
                            <select name='select-files-list' className="select-files-list" ref={fileSelectForDelete}>
                                <option value="selectFile" >Select file..</option>
                                ({filesToDeleteList.map(file => 
                                <option value={file.fileName}>{file.fileName}</option>
                                )})
                            </select>
                         <input type="button" className="delete-file-button" onClick={handleDeleteFileChanges} value="Delete"/>
                        </div>
                        ):null
                        }

                     
                        {(addFile)?( 
                        <div className="add-new-file"><label>Enter File Name : </label><input type="text" className="add-new-fileName" ref={fileName}></input>
                        <label> &nbsp;Enter File Content : </label><input type="text" className="add-file-content" ref={fileContent}></input>
                         <input type="button" className="add-to-changes-button" onClick={handleFileAddChanges} value="Add to Changes"/>
                        </div>
                        ):null}

                        {(addFilesDetails.length > 0)? (
                            <div className="addFileChangesDiv">
                                <p> New File added Details</p>
                                { addFilesDetails.map (addFilesDetail => <div className="addFileChangesDetail">
                                   <p className="valueTitle"> File Name:</p> {addFilesDetail.filename} &nbsp;  <p className="valueTitle">File Content:</p> {addFilesDetail.content}
                                     </div>
                                    )}

                            </div>
                        ):null}

                        {(updateFile)?( 
                        <div className="update-new-file">
                            <label>Choose File:</label>
                            <select name='select-files-list' className="select-files-list" ref={fileSelectForUpdate}>
                                <option value="selectFile">Select file..</option>
                                ({filesList.map(file => 
                                <option value={file}>{file}</option>
                                )})
                            </select>
                            <label>Line Number : </label><input type="number" className="update-line-no" ref={lineNumber}></input>
                            <select name="addorupdate" className="updateOption" ref={lineUpdateType} onChange={handleOnChangeUpdateOption}>
                            <option value="insert" select>Insert</option>
                            <option value="update">Update</option>
                            </select>
                        <label> &nbsp;Enter Changes : </label><input type="text" className="update-line-change" ref={lineChanges}></input>
                         <input type="button" className="update-to-changes-button" onClick={handleFileUpdateChanges} value="Update Changes"/>
                        </div>
                        ):null}

                    {/* {(updateFilesDetails.length > 0)? (
                            <div className="updateFileChangesDiv">
                                <p> File Changes Details</p>
                                { updateFilesDetails.map (updateFilesDetail => <div className="addFileChangesDetail">
                                <p className="valueTitle"> File Name:</p> {updateFilesDetail.fileName} &nbsp; <p className="valueTitle">Action:</p> {updateFilesDetail.lineUpdateType} &nbsp; <p className="valueTitle">Line Number:</p> {updateFilesDetail.lineNumber}
                                <p className="valueTitle">Line Changes:</p> {updateFilesDetail.lineChanges} 
                                     </div>
                                    )}

                            </div>
                        ):null} */}

                    {(updateFilesDetailsWithFileNameMap &&  Object.keys(updateFilesDetailsWithFileNameMap).length > 0)? (
                            <div className="updateFileChangesDiv">
                                <p> File Changes Details</p>

                                {Object.keys(updateFilesDetailsWithFileNameMap).map((key) => {
                                    return (<div className="updateFileChangesDetailsDiv"> <p className="valueTitle"> File Name:  </p> {key}
                                     <div class = "updateFileChangesDetails"> 
                                        {updateFilesDetailsWithFileNameMap[key].map((updateFilesDetail) => {
                                          return( <>
                                             <p className="valueTitle">Line Number: </p>{updateFilesDetail.lineNo}  
                                             {(updateFilesDetail.insert)?<> <p className="valueTitle">Insert:</p> {updateFilesDetail.insert} </>: <> <p className="valueTitle">Update:</p> {updateFilesDetail.update}</>}
                                                <br/>
                                             </>)
                                        })} 
                                    
                                     </div>
                                      
                                       </div>)                          
                                }
                                )} 
                                

                                {/* { updateFilesDetailsWithFileNameMap.map (updateFilesDetail => <div className="addFileChangesDetail">
                                <p className="valueTitle"> File Name:</p> {updateFilesDetail.filename} 
                                <div class = "updateFileChangesDetails"> 

                                &nbsp; <p className="valueTitle">Action:</p> {updateFilesDetail.lineUpdateType} &nbsp; <p className="valueTitle">Line Number:</p> {updateFilesDetail.lineNumber}
                                <p className="valueTitle">Line Changes:</p> {updateFilesDetail.lineChanges} </div>
                                     </div>
                                    )} */}

                            </div>
                        ):null}
                        <>
                    
                        {(updateFilesDetails.length > 0 || addFilesDetails.length > 0)?
                        (<div className="commitMetaInfo">
                            <p className="commitLabel">Enter commit message :</p> 
                            <input type="text" className="commitMessage" ref={commitMessageRef}/>
                            <div className="commitPushButtonDiv"> <input type="submit" className="commitPushButton" value="Commit &#38; Push" onClick={handleCommitPush}/>
                            </div>                         
                             </div>):null}
                             </>
                           
                    </div>
                        

            </Modal.Body>
            </Modal>
        ):null}
        </>

    )
}

export default Commit
