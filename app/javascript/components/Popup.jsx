import React from "react";
import "../stylesheets/popup.css"
import autosize from 'autosize';

class Popup extends React.Component {
    constructor(props){
        super(props);
        this.state = {tagList: props.tagList,
                      tags: props.tags[props.todo.id    ],
                      newTag: false};
        this.openNewTag = this.openNewTag.bind(this);
        this.unfocusForm = this.unfocusForm.bind(this);
        this.deleteTags = this.deleteTags.bind(this);
    }

    createTagHTML(tag){
        return (
            <div key = {tag.id} className="card px-3 tag_canvas" >
                <div className="row_">
                    <input 
                        type="checkbox" 
                        onChange={this.tagToggle(this.props.todo, tag)} 
                        checked={this.state.tags.some(e => e.id === tag.id)}
                        className="checkbox tag_check"
                        style = {{backgroundColor: `#${tag.hex}`}}/>
                    <div className="tagBox" style = {{textDecorationColor: `#${tag.hex}`}}>
                        {tag.name}
                    </div>
                    <button value = {tag.id}
                            onClick={this.deleteTags}
                            className="del_tag close">x</button>
                    {/* <div style={{"background": `#${tag.hex}`}}>hello</div> */}
                </div>
            </div>
        )
    }

    deleteTags(event){
        const url = "api/v1/tags/destroy";
        const token = document.querySelector('meta[name="csrf-token"]').content;
        const body = {tag_id: event.target.value}
        const cb = response => {
            let newTags = this.state.tagList.slice();
            parseInt(event.target.value) === this.props.sort_by ? this.props.nullify_sort_by() : ""
            this.setState({tagList: newTags.filter(e => e.id !== parseInt(event.target.value))});
        };
        this.props.retrieve(url, "DELETE", body, cb, token);
    }

    createTagforTodo(todo, tag){
        const url = `api/v1/tags/link`;
        const token = document.querySelector('meta[name="csrf-token"]').content;
        const body = {todo_id: todo.id,
                      tag_id: tag.id};
        const cb = response => {
            this.setState(state => {
                return {tags: state.tags.concat(response.tag)}
            })
        };

        this.props.retrieve(url, "POST", body, cb, token);
    }

    deleteTagforTodo(todo, tag){
        const url = "api/v1/tags/destroyLink";
        const token = document.querySelector('meta[name="csrf-token"]').content;
        const body = {tag_id: tag.id,
                      todo_id: todo.id}
        const cb = response => {
            let new_arr = this.state.tags.slice();
            new_arr = new_arr.filter(e => e.id !== response.tag.id);
            this.setState({tags: new_arr});
        };

        this.props.retrieve(url, "DELETE", body, cb, token);
    }

    tagToggle(todo, tag){
        return event => event.target.checked ? this.createTagforTodo(todo, tag) : this.deleteTagforTodo(todo, tag);
    }

    newTagHTML(){
        return (
            <div key = {1} className="card px-3 tag_canvas">
                <h6>
                    <form onSubmit={this.unfocusForm}>
                        <input type="checkbox"
                               className="tag_check checkbox"/>
                        <input type='text' 
                            autoFocus
                            onBlur={this.unfocusForm}
                            className="addTagBox"
                            />
                    </form>
                </h6>
            </div>
        )}

    componentDidMount(){
        autosize(document.querySelector('textarea'))
    }
    componentWillUnmount(){
        autosize.destroy(document.querySelector('textarea'))
    }

    openNewTag(){
        this.setState({newTag: true});
    }

    unfocusForm(event){
        event.preventDefault();
        this.setState({newTag: false});
        const tagName = event.type ==="submit" ? event.target["1"].value :event.target.value
        this.addTag(tagName);
    }

    addTag(tagName){
        const url = "api/v1/tags/create/";
        const body = {name: tagName};
        const token = document.querySelector('meta[name="csrf-token"]').content;
        const cb = response => {
            let newTag = this.state.tagList.slice();
            response.tag.hex = response.color.hex
            newTag.push(response.tag);  
            
            this.setState({tagList: newTag});
        };
        this.props.retrieve(url, "POST", body, cb, token);
    }

    getUnusedColor(){
        this.props.retrieve("api/v1/colors/first", "GET", null, response => console.log(response), null);
    }


    render(){
        const TagHTML = this.state.tagList.map(e => this.createTagHTML(e))

        return (
            <div className="popup_canvas">
                <br></br>
                <textarea type="text" defaultValue = {this.props.todo.task} onInput={this.props.input} className="edit_todo_form form-control col-12"/>
                <br></br>
                {TagHTML}
                {this.state.newTag ? this.newTagHTML() : ""}
                <br></br>
                {!this.state.newTag && this.state.tagList.length < 10 ? <input type="button" value="+" onClick={this.openNewTag} className="btn addTagBtn"/> : ""
                }

            </div>
        )
    }
}

export default Popup