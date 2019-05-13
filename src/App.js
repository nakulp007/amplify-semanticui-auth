import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";

import {
  Container,
  Grid,
  Header,
  Icon,
  Image,
  Menu,
  Responsive,
  Segment,
  Sidebar
} from 'semantic-ui-react'

import Routes from "./Routes";
import "./App.css";

import { Auth } from "aws-amplify";

class App extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      sidebarVisible: false,
    };
  }

  handleSidebarButtonClick = () => this.setState({ sidebarVisible: !this.state.visible })

  handleSidebarHide = () => this.setState({ sidebarVisible: false })

  async componentDidMount() {
    try {
      if (await Auth.currentSession()) {
        this.userHasAuthenticated(true);
      }
    }
    catch(e) {
      //The Auth.currentSession() method throws an error No current user 
      //if nobody is currently logged in. We don’t want to show this error 
      //to users when they load up our app and are not signed in.
      if (e !== 'No current user') {
        alert(e);
      }
    }
  
    this.setState({ isAuthenticating: false });
  }
  
  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = async event => {
    await Auth.signOut();
  
    this.userHasAuthenticated(false);
    this.handleSidebarHide();

    //redirect user to login page
    this.props.history.push("/login");
  }


  /*
  //Navbar.Collapse component ensures 
  //that on mobile devices the two links will be collapsed.

  //wrap <NavItem href="/signup">Signup</NavItem>
  //around LinkContainer so when we click
  //navbar items they dont refresh the entire page and use React Router instead
  
  The Fragment component can be thought of as a placeholder component. 
  We need this because in the case the user is not logged in, 
  we want to render two links. To do this we would need to wrap it 
  inside a single component, like a div. But by using the Fragment 
  component it tells React that the two links are inside this component 
  but we don’t want to render any extra HTML.


  Since loading the user session is an asynchronous process, 
  we want to ensure that our app does not change states when it 
  first loads. To do this we’ll hold off rendering our app till 
  isAuthenticating is false.
  We’ll conditionally render our app based on the isAuthenticating flag.
  */
  render() {
    const { sidebarVisible } = this.state

    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };


    let content = 
      <Container>
        <Routes childProps={childProps} />
      </Container>;

    let menuItem_logo = 
      <Menu.Item header as={Link} to='/'>
        <Image size='mini' src='/favicon.ico' style={{ marginRight: '1.5em' }} />
        Scratch
      </Menu.Item>;
    let menuItem_logout = <Menu.Item onClick={this.handleLogout}>Logout</Menu.Item>;
    let menuItem_signup = <Menu.Item onClick={this.handleSidebarHide} as={Link} to='/signup'>Signup</Menu.Item>;
    let menuItem_login = <Menu.Item onClick={this.handleSidebarHide} as={Link} to='/login'>Login</Menu.Item>;
    let menuItem_burgerBars = 
      <Menu.Item onClick={this.handleSidebarButtonClick}>
        <Icon name='bars'/>
      </Menu.Item>;

    let menuItems = 
      this.state.isAuthenticated
        ?   menuItem_logout
        : <Fragment>
            {menuItem_signup}
            {menuItem_login}
          </Fragment>
      ;



    let headerBarLargeScreen = 
      <Menu>
        <Container>
          {menuItem_logo}
          <Menu.Menu position='right'>
            {menuItems}
          </Menu.Menu>
        </Container>
      </Menu>;

    let headerBarSmallScreen = 
      <Menu>
        <Container>
          {menuItem_logo}
          <Menu.Menu position='right'>
            {menuItem_burgerBars}
          </Menu.Menu>
        </Container>
      </Menu>;


    let content_smallScreen = 
      <Sidebar.Pushable>
        <Sidebar
          as={Menu}
          animation='push'
          direction='right'
          duration='100'
          icon='labeled'
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={sidebarVisible}
          width='thin'
        >
          <Menu.Item as={Link} to='/' onClick={this.handleSidebarHide} style={{ display: 'flex', alignItems: 'center' }}>
            <Image size='mini' src='/favicon.ico' style={{ display: 'block', margin: '0 auto .5rem!important' }} />
            Scratch
          </Menu.Item>
          {menuItems}
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarVisible}>
          {headerBarSmallScreen}
          {content}
        </Sidebar.Pusher>
      </Sidebar.Pushable>;

    let content_largeScreen =  
        <Fragment>
            {headerBarLargeScreen}
            {content}
        </Fragment>;

    let device_size_small = "700";
    return (
      !this.state.isAuthenticating &&
      <div>
        <Responsive maxWidth={device_size_small} style={{ height: '100%' }}>
          {content_smallScreen}
        </Responsive>
        <Responsive minWidth={device_size_small} style={{ height: '100%' }}>
          {content_largeScreen}
        </Responsive>
      </div>
    );
  }
}

/*
App component does not have access to the router props directly 
since it is not rendered inside a Route component. 
To be able to use the router props in our App component 
we will need to use the withRouter Higher-Order Component (or HOC).

We need router props so we can route user to login page after clicking logout.
*/
export default withRouter(App);