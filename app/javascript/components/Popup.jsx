import React from "react";

class Popup extends React.Component {
    constructor(props){
        super(props);
        this.state = {tags: []};
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
                </h6>
            </div>
        )
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

    


    componentDidMount(){
        this.tagsOfTodo(this.props.todo)
    }

    render(){
        const TagHTML = this.props.tagList.map(e => this.createTagHTML(e))
        console.log(this.state)

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