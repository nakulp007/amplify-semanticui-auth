/*
Since we need to show the user a form to enter the confirmation code, 
we are conditionally rendering two forms based on if we have a 
user object or not.

We are using the LoaderButton component that we created earlier 
for our submit buttons.

Since we have two forms we have two validation methods called 
validateForm and validateConfirmationForm.

We are setting the autoFocus flags on the email and the confirmation 
code fields.


In handleSubmit we make a call to signup a user. 
This creates a new user object.
Save that user object to the state as newUser.

In handleConfirmationSubmit use the confirmation code 
to confirm the user.

With the user now confirmed, 
Cognito now knows that we have a new user that can login to our app.

Use the email and password to authenticate exactly 
the same way we did in the login page.

Update the App’s state using the userHasAuthenticated method.

Finally, redirect to the homepage.





A quick note on the signup flow here. 
If the user refreshes their page at the confirm step, 
they won’t be able to get back and confirm that account. 
It forces them to create a new account instead. 

We are keeping things intentionally simple but here are a 
couple of hints on how to fix it.
1. Check for the UsernameExistsException in the handleSubmit method’s catch block.
2. Use the Auth.resendSignUp() method to resend the code if the user has not been previously confirmed. Here is a link to the Amplify API docs.
3. Confirm the code just as we did before.

Give this a try and post in the comments if you have any questions.


Now while developing you might run into cases 
where you need to manually confirm an unauthenticated user. 
You can do that with the AWS CLI using the following command.

aws cognito-idp admin-confirm-sign-up \
   --region YOUR_COGNITO_REGION \
   --user-pool-id YOUR_COGNITO_USER_POOL_ID \
   --username YOUR_USER_EMAIL
*/

import React, { Component } from "react";
import { Form } from 'semantic-ui-react';
import LoaderButton from "../../components/LoaderButton";
import "./Signup.css";

import { Auth } from "aws-amplify";

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      newUser: null
    };
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
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
      const newUser = await Auth.signUp({
        username: this.state.email,
        password: this.state.password
      });
      this.setState({
        newUser
      });
    } catch (e) {
      alert(e.message);
    }
  
    this.setState({ isLoading: false });
  }
  
  handleConfirmationSubmit = async event => {
    event.preventDefault();
  
    this.setState({ isLoading: true });
  
    try {
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      await Auth.signIn(this.state.email, this.state.password);
  
      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  renderConfirmationForm() {
    return (
      <Form onSubmit={this.handleConfirmationSubmit}>        
        <Form.Field >
          <label htmlFor='confirmationCode'>Confirmation Code</label>
          <Form.Input
            id='confirmationCode'
            autoFocus
            type="tel"
            value={this.state.confirmationCode}
            onChange={this.handleChange}
          />
          <p>Please check your email for code.</p>
        </Form.Field>
        <LoaderButton
          fluid
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </Form>
    );
  }

  renderForm() {
    return (
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
        <Form.Field>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input 
            id='confirmPassword'
            type="password"
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            placeholder="Passw0rd!"
          />
        </Form.Field>

        <LoaderButton
          fluid
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Signup"
          loadingText="Signing up…"
        />
      </Form>
    );
  }

  render() {
    return (
      <div className="Signup">
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}