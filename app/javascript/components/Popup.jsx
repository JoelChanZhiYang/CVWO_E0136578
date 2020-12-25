import React from "react";

class Popup extends React.Component {
    constructor(props){
        super(props);
        this.state = {tagList: props.tagList,
                      tags: [],
                      newTag: false};
        this.openNewTag = this.openNewTag.bind(this);
        this.unfocusForm = this.unfocusForm.bind(this);
        this.deleteTags = this.deleteTags.bind(this);
    }

    createTagHTML(tag){
        return (
            <div key = {tag.id}>
                <h6>
                    <input 
                        type="checkbox" 
                        onChange={this.tagToggle(this.props.todo, tag)} 
                        checked={this.state.tags.some(e=>e.id === tag.id)}/>
                    {tag.name}
                    <button value = {tag.id}
                            onClick={this.deleteTags}>x</button>
                </h6>
            </div>
        )
    }

    deleteTags(event){
        const url = "api/v1/tags/destroy";
        const token = document.querySelector('meta[name="csrf-token"]').content;
        const body = {tag_id: event.target.value}
        const cb = response => {
            let newTags = this.state.tagList.slice();
            this.setState({tagList: newTags.filter(e => e.id !== parseInt(event.target.value))});
        };
        this.props.retrieve(url, "DELETE", body, cb, token);
    }

    tagsOfTodo(todo){
        const url = `api/v1/tags/find/${todo.id}`;
        const cb = response => {
            this.setState({"tags": response})
        };
        this.props.retrieve(url, "GET", null, cb, null);
    }

    createTagforTodo(todo, tag){
        const url = `api/v1/tags/link`;
        const token = document.querySelector('meta[name="csrf-token"]').content;
        const body = {todo_id: todo.id,
                      tag_id: tag.id};
        const cb = response => {
            const new_arr = this.state.tags.slice();
            new_arr.push(response.tag);
            this.setState({tags: new_arr});
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
            <div key = {1}>
                <h6>
                    <form onSubmit={this.unfocusForm}>
                        <input type="checkbox"/>
                        <input type='text' 
                            autoFocus
                            onBlur={this.unfocusForm}
                            />
                    </form>
                </h6>
            </div>
        )}

    componentDidMount(){
        this.tagsOfTodo(this.props.todo)
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
            newTag.push(response);
            this.setState({tagList: newTag});
        };
        this.props.retrieve(url, "POST", body, cb, token);
    }

    render(){
        const TagHTML = this.state.tagList.map(e => this.createTagHTML(e))

        return (
            <div>
                <br></br>
                <input type="text" defaultValue = {this.props.todo.task} onInput={this.props.input}/>
                <br></br>
                {TagHTML}
                {this.state.newTag ? this.newTagHTML() : ""}
                <br></br>
                {this.state.newTag ? "":
                <input type="button" value="+" onClick={this.openNewTag}/>
                }

            </div>
        )
    }
}

export default Popup