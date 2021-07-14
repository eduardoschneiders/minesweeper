import { Component } from 'react';
import './User.css'
import SignupForm from './SignupForm.js';
import SigninForm from './SigninForm.js';

class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: "",
      currentUsername: "",
      currentPassword: "",
      currentAction: ""
    }

    this.activateSignup = this.activateSignup.bind(this);
    this.activateSignin = this.activateSignin.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  activateSignup() {
    this.setState({ currentAction: 'signup' })
  }

  activateSignin() {
    this.setState({ currentAction: 'signin' })
  }

  handleChangeUsername(e) {
    this.setState({currentUsername: e.target.value});
  }

  handleChangePassword(e) {
    this.setState({currentPassword: e.target.value});
  }

  onSignup(username, password) {
    fetch('http://localhost:5000/api/v1/users',
			  {
			  	method: "post",
			  	headers: { 'Content-Type':'application/json' },
			  	body: JSON.stringify({username: username, password: password})
			  }
		  )
        .then(data => data.json())
	      .then(data => {
          this.props.onSignup(data)
        })
        .catch(function(error) {
          alert('Error to signup: ' + error.message);
        });

    this.setState({
      currentUser: {username: username},
      currentAction: ''
    })
  }

  onSignin(username, password) {
    fetch('http://localhost:5000/api/v1/users/signin',
			  {
			  	method: "post",
			  	headers: { 'Content-Type':'application/json' },
			  	body: JSON.stringify({username: username, password: password})
			  }
		  )
        .then(data => {

          if (data.status === 404) {
            throw 'Failed to login';
          }

          return data
        })
        .then(data => data.json())
	      .then(data => {
          this.setState({
            currentUser: {username: username},
            currentAction: ''
          })

          this.props.onSignin(data)
        })
        .catch(function(error) {
          alert('Failed to login', error);
        });
  }

  render () {
    let userStatus= null
    if (this.state.currentUser) {
      userStatus = "Olá " + this.state.currentUser.username
    }

    let signupStatus = 'hide'
    let signinStatus = 'hide'

    if (this.state.currentAction === 'signup') { signupStatus = ''}
    if (this.state.currentAction === 'signin') { signinStatus = ''}

    return(
      <div className="user">
        {userStatus}<br /><br />

        <button onClick={this.activateSignup}>
          Signup
        </button>

        <button onClick={this.activateSignin}>
          Signin
        </button>

        <div className={signupStatus}>
          <SignupForm onSubmitForm={this.onSignup.bind(this)}/>
        </div>

        <div className={signinStatus}>
          <SigninForm onSubmitForm={this.onSignin.bind(this)} />
        </div>
      </div>
    )
  }
}

export default User
