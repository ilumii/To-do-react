import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {Input, Button} from 'semantic-ui-react'
import './App.css';

class App extends Component { 
  state = {
    user: '',
    notice: '',
    login: false,
    list: [],
    task: '',
    main: true
  }

  makeState = name => ({ target }) =>
    this.setState({ [name]: target.value });

  Login = () =>{
    axios.post('https://hunter-todo-api.herokuapp.com/auth', {username: this.state.user})
    .then(res =>{
      Cookies.set('cookie', res.data.token);
      this.setState({})
      this.GetList();
      this.setState({main: false})
    })
    .catch(error =>{
      this.setState({
        notice: "User Does Not Exist",
      })
    })
  }

  Register = () =>{
    axios.post('https://hunter-todo-api.herokuapp.com/user', {username: this.state.user})
    .then(res => {
      console.log(res);
      console.log(res.data);
      this.setState({
        notice: "User Created",
      })
    })
    .catch(error => {
      this.setState({
        notice: "User Exists! Try Again",
      })
    })
  }

  GetList = () => {
    axios.get('https://hunter-todo-api.herokuapp.com/todo-item', {headers: {'sillyauth': Cookies.get('cookie')}})
    .then(res =>{
      console.log(res);
      console.log(res.data);
      this.setState({
        list: res.data,
        login: true
      })
      console.log("current list")
      console.log(this.state.list)
    })
  }

  handleDelete = (id) =>{
    axios.delete(`https://hunter-todo-api.herokuapp.com/todo-item/${id}`, {headers: {'sillyauth': Cookies.get('cookie')}}) 
    .then(res =>{
      console.log(res);
      console.log(res.data);
      this.GetList();
    }) 
  }

  handleNewTask = () =>{
    axios.post('https://hunter-todo-api.herokuapp.com/todo-item', {content: this.state.task}, {headers: {'sillyauth': Cookies.get('cookie')}})
    .then(res =>{
      console.log(res);
      console.log(res.data);
      this.GetList();
    })
  }

  handleComplete = (id) =>{
    axios.put(`https://hunter-todo-api.herokuapp.com/todo-item/${id}`, {completed: true}, {headers: {'sillyauth': Cookies.get('cookie')}})
    .then(res =>{
      console.log(res);
      console.log(res.data);
      this.GetList();
    })
  }

  logout = () =>{
    Cookies.remove('cookie');
    this.setState({
      user:'',
      main: true,
      login: false,
      list: [],
      notice: 'Logged Out!'
    })
  }

  render() {
    let list = this.state.list.map((item) =>
      <div key = {item.id}>
          <p><b>Task:</b> {item.content}</p>
          <p><b>Status:</b> {item.completed.toString()}</p>
          <Button onClick={() => this.handleDelete(item.id)}> Delete </Button>
          <Button onClick={() => this.handleComplete(item.id)}> Completed </Button>
      </div>
    );
    return (
      <div>
        <div>
          {this.state.main ?(
            <div className = "Main">
              <h1> To Do App </h1>
              <Input type='text' placeholder='Username' onChange={this.makeState('user')} />
              <Button onClick={() => this.Login()}> Login </Button>
              <Button onClick={() => this.Register()}> Register </Button>
              <br/>
              {this.state.notice}
            </div>
          ):<div></div>}
        </div>
        <div className = 'Login'>
          {this.state.login ?(
            <div>
              <h1>{this.state.user}</h1>
              {list}
              <br/>
              <Input type='text' placeholder='Enter New Task' onChange={this.makeState('task')} />
              <Button onClick={() => this.handleNewTask()}> Submit </Button>
              <br/>
              <br/>
              <Button onClick={() => this.logout()}> Logout </Button>
            </div>
          ):<div></div>}
        </div>
      </div>
    );
  }
}

export default App;
