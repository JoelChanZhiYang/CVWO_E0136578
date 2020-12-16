import React from "react";
import { Link } from "react-router-dom";
import {Modal} from "react-responsive-modal"


class Popup extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        return (
            <div>
                <br></br>
                <input type="text" defaultValue = {this.props.todo.task} onInput={this.props.input}/>
            </div>
        )
    }
}

export default Popup