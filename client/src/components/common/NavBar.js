import React, { Component } from 'react'
import styles from '../../css/common/common.css'

export class NavBar extends Component {
    componentDidMount() {
        document.title="Activity Monitoring"
    }
    render() {
        return (
            <div className="navbar-div">
                    <p className="title-content">Simple Version Control User Activity Tracking</p>
            </div>
        )
    }
}

export default NavBar
