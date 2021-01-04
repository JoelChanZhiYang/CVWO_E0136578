import React from "react";
import 'react-responsive-modal/styles.css';
import {Modal} from "react-responsive-modal"
import '../stylesheets/todo.css'
import Popup from './Popup'
import logo from '../../assets/images/sideQuestLogo.png'

class Todos extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            todos: [],
            popUp: false,
            tags: {},
            tagList:[]
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.changeCompletedStatus = this.changeCompletedStatus.bind(this);
        this.changeTodoTask = this.changeTodoTask.bind(this);
        this.onOpenModal = this.onOpenModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
    }

    retrieve(url, method, body, callback, token){
        const options = {
            method: method,
            mod: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
        }
        if (body){
            options.body = JSON.stringify(body);
        }
        if (token){
            options.headers["X-CSRF-Token"] = token;
        }
        fetch(url, options)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    throw new Error();
                }
            })
            .then(callback)
            .catch(error => console.log(error.message))
    }

    onOpenModal(todo){
        return event => {
            this.setState({popUp:true, popUpTodo: todo}
        )}
    }

    onCloseModal(event){
        this.setState({popUp: false})
        this.componentDidMount();
    }

    onSubmit(event){
        event.preventDefault();
        const newAction = event.target[0].value
        const url = "/api/v1/todos/create";
        const body = {task: newAction, 
                completed: false};
        const token = document.querySelector('meta[name="csrf-token"]').content;
        const cb = response => {
            const new_state = this.state.todos.slice(0);
            new_state.unshift(response);
            this.setState({todos:new_state});
            event.target[0].value = "";
        }
        this.retrieve(url, "POST", body, cb, token)
    }

    onDelete(event){
        event.stopPropagation();
        const todo_id = event.target.value;
        const url = `/api/v1/todos/destroy/${todo_id}`;
        const token = document.querySelector('meta[name="csrf-token"]').content;
        const cb = response => {
            let new_state = this.state.todos.slice()
            new_state = new_state.filter(x => x.id !== parseInt(todo_id))
            this.setState({todos:new_state})
        }
        this.retrieve(url, "DELETE", null, cb, token);

    }

    changeCompletedStatus(todo){
        return event => {
            const todo_id = event.target.value
            const url = `api/v1/todos/update/${todo_id}`;
            const token = document.querySelector('meta[name="csrf-token"]').content;
            const body = {task: todo.task,
                          completed: !todo.completed}
            const cb = response => {
                let new_state = this.state.todos.slice()
                const curr_todo = new_state.find(x => x.id === response.id)
                curr_todo.completed = !curr_todo.completed
                curr_todo.updated_at = response.updated_at
                this.setState(new_state)
            }
            this.retrieve(url, "PUT", body, cb, token);
        }
    }


    changeTodoTask(todo){
        return event => {
            const todo_id = todo.id
            const value = event.target.value
            const url = `api/v1/todos/update/${todo_id}`;
            const token = document.querySelector('meta[name="csrf-token"]').content;
            const body = {task: value,
                          completed: todo.completed}
            const cb = response => {
                let new_state = this.state.todos.slice()
                const curr_todo = new_state.find(x=> x.id === todo.id)
                curr_todo.task = value
                this.setState(new_state)
            }
            this.retrieve(url, "PUT", body, cb, token);
        }   
    }

    componentDidMount(){
        const url = 'api/v1/todos/index'
        const cb = response => {
            response.tagList.map((e, index) => {
                e.hex = response.hex[index]
                return e;
            })

            this.setState({todos: response.todo, tags:response.tags, tagList:response.tagList})
        }
        this.retrieve(url, "GET", null, cb);
    }

    comp(a, b){
        const keyA = a.updated_at
        const keyB = b.updated_at
        return keyA > keyB ? -1
                            : keyA < keyB ? 1 : 0
    }
    
    make_todo_html(action, index, todo){
        const halt = e => e.stopPropagation();
        const tag_labels = (
        <div className="tag_label_container">
            {this.state.tagList.filter(tag => this.state.tags[todo.id].some(cur_tag => cur_tag.id == tag.id)).map(e => (
                <span className="tag_label" 
                      style={{backgroundColor:`#${e.hex}`}}
                      key = {e.id}>
                </span>))}
        </div>
        );

        return (
            <div key= {index} className="row justify-content-center">
                <div className = "col-sm-12 col-md-7 col-lg-5 task">
                    <div className="card px-3 todo" onClick={this.onOpenModal(todo)} >
                        <input type ="checkbox"
                            value = {todo.id} 
                            checked = {todo.completed ? true : false} 
                            onChange={this.changeCompletedStatus(todo)}
                            onClick = {halt} // This is to prevent the click event from propogating into the parent div

                            className="form-check-input checkBox"
                        />
                        <div className="actionBox cancelled">
                            <div>{action}</div>
                            {tag_labels}
                        </div>
                        <button value = {todo.id} 
                            onClick={this.onDelete}
                            className="close del_todo">x</button>
                    </div>
                </div>
            </div>
            )
    }

    render() {
        const todos = this.state.todos
        const completedTodos = todos.filter(x => x.completed == true)
        const uncompletedTodos = todos.filter(x => x.completed == false)
        completedTodos.sort(this.comp)
        uncompletedTodos.sort(this.comp)
        const completed_out = completedTodos.map(todo => this.make_todo_html(todo.task, todo.id, todo));
        const uncompleted_out = uncompletedTodos.map(todo=> this.make_todo_html(todo.task, todo.id, todo));

        return (
            <div className="container mt-4">
                <div className= "row justify-content-center">
                    <div className="col-sm-12 col-md-7 col-lg-5">
                        <img src={logo}></img>
                        <form onSubmit={this.onSubmit} className="form-inline add_todo" autoComplete="off">
                            <input type="text" name = "new_todo" className="form-control block col-8"></input>
                            <input type="submit" className="addTodoButton btn btn-info col-4" value="submit"/>
                        </form>
                    </div>
                </div>

                <br></br>
                
                <ul>{uncompleted_out}</ul>
                <br></br>
                <ul>{completed_out}</ul>

                <Modal open = {this.state.popUp} 
                       onClose = {this.onCloseModal} 
                       center
                       classNames={{
                           modal:'modal col-sm-8 col-md-5 col-lg-4'
                       }}
                       >
                    <Popup todo={this.state.popUpTodo} 
                           input={this.changeTodoTask(this.state.popUpTodo)} 
                           tagList = {this.state.tagList} 
                           retrieve ={this.retrieve}
                           tags = {this.state.tags}/>
                </Modal>
            </div>
        );
    }
}

export default Todos;   