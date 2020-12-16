import React from "react";
import { Link } from "react-router-dom";
import 'react-responsive-modal/styles.css';
import {Modal} from "react-responsive-modal"
import '../stylesheets/todo.css'
import Popup from './Popup'

class Todos extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            todos: [],
            popUp: false
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onOpenModal = this.onOpenModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
    }

    make_todo_html(action, index, todo){
        return (
            <div key= {index} className="d-flex justify-content-center">
                <input type ="checkbox" value = {todo.id} checked = {todo.completed ? true : false} onChange={this.onClick(todo)}/>
                <div className="card px-3">
                    <li onClick={this.onOpenModal(todo)}>{action}</li>
                </div>
                <button value = {todo.id} onClick={this.onDelete}>x</button>
            </div>
            )
    }

    onOpenModal(todo){
        return event => this.setState({popUp:true, popUpTodo: todo})
    }

    onCloseModal(event){
        this.setState({popUp: false})
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
            const todo_id = event.target.value
            const url = `api/v1/todos/update/${todo_id}`;
            const token = document.querySelector('meta[name="csrf-token"]').content;
            const body = {task: todo.task,
                          completed: !todo.completed}
            fetch(url, {
                method: "PUT",
                headers:{
                    "X-CSRF-Token": token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
                .then(response => {
                    if (response.ok){
                        return response.json()
                    } else {
                        throw new Error("onClick not done")
                    }
                })
                    .then(response => {
                        let new_state = this.state.todos.slice()
                        const curr_todo = new_state.find(x => x.id == response.id)
                        curr_todo.completed = !curr_todo.completed
                        curr_todo.updated_at = response.updated_at
                        this.setState(new_state)
                    })
                    .catch(error => console.log(error.message))
        }
    }


    onInput(todo){
        return event => {
            const todo_id = todo.id
            const value = event.target.value
            const url = `api/v1/todos/update/${todo_id}`;
            const token = document.querySelector('meta[name="csrf-token"]').content;
            const body = {task: value,
                          completed: todo.completed}
            fetch(url, {
                method: "PUT",
                headers:{
                    "X-CSRF-Token": token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
                .then(response => {
                    if (response.ok){
                        return response.json()
                    } else {
                        throw new Error("onClick not done")
                    }
                })
                    .then(response => {
                        let new_state = this.state.todos.slice()
                        const curr_todo = new_state.find(x=> x.id == todo.id)
                        curr_todo.task = value
                        this.setState(new_state)

                    })
                    .catch(error => console.log(error.message))
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

    // testFunction(){
    //     const url = `api/v1/tags/destroyLink/`;
    //     const token = document.querySelector('meta[name="csrf-token"]').content;
    //     const body = {todo_id: 81,
    //                   tag_id:5}
    //     fetch(url, {
    //         method: "DELETE",
    //         headers:{
    //             "X-CSRF-Token": token,
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(body)
    //     })
    //         .then(response => {
    //             if (response.ok){
    //                 return response.json()
    //             } else {
    //                 throw new Error("onClick not done")
    //             }
    //         })
    //             .then(response => {
    //                 console.log(response)
    //             })
    //             .catch(error => console.log(error.message))
    // }

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
        const completed_out = completedTodos.map(todo => this.make_todo_html(todo.task, todo.id, todo));
        const uncompleted_out = uncompletedTodos.map(todo=> this.make_todo_html(todo.task, todo.id, todo));
        const {popUp} = this.state

        return (
            <div>
                <Modal open = {this.state.popUp} onClose = {this.onCloseModal} center>
                    <Popup todo={this.state.popUpTodo} input={this.onInput(this.state.popUpTodo)}/>
                </Modal>
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