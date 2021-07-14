import { Component } from 'react';

class SigninForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: "",
      currentUsername: "",
      currentPassword: ""
    }

    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeUsername(e) {
    this.setState({currentUsername: e.target.value});
  }

  handleChangePassword(e) {
    this.setState({currentPassword: e.target.value});
  }

  handleSubmit(e) {
    this.props.onSubmitForm(this.state.currentUsername, this.state.currentPassword)
    e.preventDefault();
  }

  render () {
    return(
      <div className="signinForm">
        Signin<br />
        <form onSubmit={this.handleSubmit}>
          <label>
            <input type="text" placeholder="Username:" value={this.state.currentUsername} onChange={this.handleChangeUsername} />
          </label><br />

          <label>
            <input type="password" placeholder="Password:" value={this.state.currentPassword} onChange={this.handleChangePassword} />
          </label><br /><br />

          <input type="submit" value="Signin" />
        </form>
      </div>
    )
  }
}

export default SigninForm
