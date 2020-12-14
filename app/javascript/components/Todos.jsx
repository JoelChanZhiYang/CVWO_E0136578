import React from "react";
import { Link } from "react-router-dom";

class Todos extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            todos:[]
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    make_todo_html(action, index, todo){
        return (
            <div key= {index} className="d-flex justify-content-center">
                <input type ="checkbox" value = {todo.id} checked = {todo.completed ? true : false} onClick={this.onClick(todo)}/>
                <div className="card px-3">
                    <li key={index}>{action}</li>
                </div>
                <button value = {todo.id} onClick={this.onDelete}>x</button>
            </div>
            )
    }

    

    onSubmit(event){
        event.preventDefault();
        const newAction = event.target[0].value
        const url = "/api/v1/todos/create";
        const body1 = {task: newAction, 
                completed: false};
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(url, {
            method: "POST",
            headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body1)
        })
        .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    throw new Error();
                }
            })
        .then(response => {
            const new_state = this.state.todos.slice(0)
            new_state.unshift(response)
            this.setState({todos:new_state})
            event.target[0].value = ""
        })
        .catch(error => console.log(error.message));
    }

    onDelete(event){
        const todo_id = event.target.value
        console.log(todo_id, this)
        const url = `/api/v1/todos/destroy/${todo_id}`;
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(url, {
            method:"DELETE",
            headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    throw new Error();
                }
            })
            .then(response => {
                let new_state = this.state.todos.slice()
                new_state = new_state.filter(x => x.id != todo_id)
                this.setState({todos:new_state})

            })
            .catch(error => console.log(error.message))

    }


    onClick(todo){
        return event => {
            console.log(event)
            const todo_id = event.target.value

            const url = `api/v1/todos/update/${todo_id}`;
            const token = document.querySelector('meta[name="csrf-token"]').content;
            const body = {task: todo.task,
                          completed: true}
            console.log(body)
            fetch(url, {
                method: "PUT",
                headers:{
                    "X-CSRF-Token": token,
                    "Content-Type": "application/json"
                }
            })
        }
    }

    componentDidMount(){
        const url = 'api/v1/todos/index'
        fetch(url)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    throw new Error();
                }
            })
            .then(response => this.setState({todos: response}))
            .catch(() => "error");
    }

    comp(a, b){
        const keyA = a.updated_at
        const keyB = b.updated_at
        return keyA > keyB ? -1
                            : keyA < keyB ? 1 : 0
    }

    render() {
        const todos = this.state.todos
        const completedTodos = todos.filter(x => x.completed == true)
        const uncompletedTodos = todos.filter(x => x.completed == false)
        completedTodos.sort(this.comp)
        uncompletedTodos.sort(this.comp)
        const completed_out = completedTodos.map((todo, index) => this.make_todo_html(todo.task, index, todo));
        const uncompleted_out = uncompletedTodos.map((todo, index) => this.make_todo_html(todo.task, index, todo));

        return (
        <div>
            <div className="add-items d-flex justify-content-center">
                <form onSubmit={this.onSubmit}>
                    <input type="text" name = "new_todo"></input>
                    <input type="submit"/>
                </form>
            </div>

            <br></br>
            
            <ul>{uncompleted_out}</ul>
            <br></br>
            <ul>{completed_out}</ul>
        </div>
        );
    }
}

export default Todos;

