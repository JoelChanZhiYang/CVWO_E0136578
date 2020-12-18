import React from "react";
import { Link } from "react-router-dom";
import {Modal} from "react-responsive-modal"


class Popup extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    createTagHTML(tag){
        return (
            <h6 key = {tag.id}>{tag.name}</h6>
        )
    }

    render(){
        const TagHTML = this.props.tagList.map(e => this.createTagHTML(e))

        return (
            <div>
                <br></br>
                <input type="text" defaultValue = {this.props.todo.task} onInput={this.props.input}/>
                <br></br>
                {TagHTML}
            </div>
        )
    }
}

export default Popup