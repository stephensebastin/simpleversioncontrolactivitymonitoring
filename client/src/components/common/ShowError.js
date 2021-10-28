import React,{Component} from 'react'
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();



export class ShowError extends Component  {

    render() {
        console.log("shpw error mehtod")
        return (
            <div>
          {/*       {toast.error(this.props.errorMessage,{autoClose:5000}) }
           */}
            </div>
        )
    }
}


export default ShowError
