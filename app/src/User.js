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
    console.log('username')
    this.setState({currentUsername: e.target.value});
  }

  handleChangePassword(e) {
    console.log('páss')
    this.setState({currentPassword: e.target.value});
  }

  onSignup(username, password) {
    console.log('signup', username, password)
    fetch('http://localhost:5000/',
			  {
			  	method: "post",
			  	headers: { 'Content-Type':'application/json' },
			  	body: JSON.stringify({username: username, password: password})
			  }
		  )
        .then(data => data.json())
	      .then(data => {
          console.log(data)
        })
        .catch(function(error) {
          console.log('Error to signup: ' + error.message);
        });
  }

  onSignin(username, password) {
    console.log('signin', username, password)
  }

  render () {

    let signupStatus = 'hide'
    let signinStatus = 'hide'

    if (this.state.currentAction === 'signup') { signupStatus = ''}
    if (this.state.currentAction === 'signin') { signinStatus = ''}

    return(
      <div className="user">
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
