import { Component } from 'react';

class SignupForm extends Component {
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
      <div className="user">
        Signup
        <form onSubmit={this.handleSubmit}>
          <label>
            Username:
            <input type="text" value={this.state.currentUsername} onChange={this.handleChangeUsername} />
          </label>

          <label>
            Password:
            <input type="password" value={this.state.currentPassword} onChange={this.handleChangePassword} />
          </label>

          <input type="submit" value="Signup" />
        </form>
      </div>
    )
  }
}

export default SignupForm



