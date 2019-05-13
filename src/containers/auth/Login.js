import React, { Component } from "react";
import { Form } from 'semantic-ui-react';
import LoaderButton from "../../components/LoaderButton";
import "./Login.css";

import { Auth } from "aws-amplify";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
        isLoading: false,
        email: "",
        password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      await Auth.signIn(this.state.email, this.state.password);

      //this components receives props from App -> Routes -> This page
      //one of the props is userHasAuthenticated method
      //which sets state of App
      //We want the logged in state to be known in upper levels
      //this is how we handle that.
      this.props.userHasAuthenticated(true);

      //Redirect the user to the homepage after they login.
      //Since our Login component is rendered using a Route, 
      //it adds the router props to it. 
      //So we can redirect using the this.props.history.push method.

      //now we are doing this using redirect in Unauthenticated route.
      //this.props.history.push("/");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }
  render() {
    return (
      <div className="Login">
        <Form onSubmit={this.handleSubmit} >
          <Form.Field >
            <label htmlFor='email'>Email</label>
            <Form.Input
              id='email'
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
              placeholder="admin@example.com"
            />
          </Form.Field>
          <Form.Field>
            <label htmlFor='password'>Password</label>
            <input 
              id='password'
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
              placeholder="Passw0rd!"
            />
          </Form.Field>
          <LoaderButton
            fluid
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Logging in…"
          />
        </Form>
      </div>
    );
  }
}