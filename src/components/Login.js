import React, { Component } from 'react'
import PropTypes from 'prop-types'

import background from '../img/header.jpg'

/**
 * ReactComponent Login
 * Displays the login page
 */
class Login extends Component {

	/**
	 * We need to initialise state here
	 * @param  {Object} props 
	 */
	constructor(props){
		super(props)

		this.state = {
			error: ''
		}
	}

	/**
	 * Surfacing the Router
	 * @type {Object}
	 */
	static contextTypes = {
		router: PropTypes.object
	}

	/**
	 * Taking care of the top navbar transparency
	 */
	componentDidMount(){
		 document.querySelector('#navigation').classList.add('navbar-transparent');
	}
	
	/**
	 * Handling login form submission and query to firebase Auth
	 * @param  {SyntheticEvent} e The submit event
	 */
	handleLogin = (e) => {
		// Stoping the submit event
		e.preventDefault()

		// Retrieving form values
		const userData = {
			email: this.email.value,
			password: this.password.value
		}

		// Asking Firebase Auth for authentication
		this.props.signIn(userData)
			// Storing user informations and go to the last visited page
			.then((user) => {
				this.props.setUserState(user)
				this.context.router.history.goBack()
			})
			// Storing error message in order to display it
			.catch(err => {
				this.setState({error: err.message})
			})
	}

	/**
	 * Handling Signup button routing
	 * @param  {SyntheticEvent} e The click event
	 */
	goToSignup = (e) => {
		e.preventDefault()
		this.context.router.history.push('/signup')
	}

	/**
	 * Rendering the login page
	 * @return {JSX/HTML} The login page template
	 */
	render(){
		const errorNotification = this.state.error && (
			<div className="alert alert-danger" role="alert">
                <div className="container">
                    {this.state.error}
                </div>
            </div>
		)
		return (
			<div className="page-header login-page clear-filter" data-filter-color="orange">
		        <div className="page-header-image" style={{backgroundImage: `url(${background})`}}></div>
		        <div className="container">
		            <div className="col-md-4 content-center">
		                <div className="card card-login card-plain">
		                    <form className="form"  onSubmit={(e) => this.handleLogin(e)}>
		                        <div className="header header-primary text-center">
		                            <div className="logo-container">
		                                <i className="fa fa-youtube fa-5x"></i>
		                            </div>
		                        </div>
								{errorNotification}
		                        <div className="content">
		                            <div className="input-group form-group-no-border input-lg">
		                                <span className="input-group-addon">
		                                    <i className="now-ui-icons users_circle-08"></i>
		                                </span>
		                                <input type="text" required id="email" className="form-control" placeholder="Email address" ref={(input) => this.email = input} />
		                            </div>
		                            <div className="input-group form-group-no-border input-lg">
		                                <span className="input-group-addon">
		                                    <i className="now-ui-icons ui-1_lock-circle-open"></i>
		                                </span>
		                                <input type="password" required id="password" className="form-control" placeholder="Password" ref={(input) => this.password = input} />
		                            </div>
		                        </div>
		                        <div className="footer text-center">
		                            <button type="submit" className="btn btn-primary btn-round btn-lg btn-block">
		                            	<i className="fa fa-sign-in"></i>&nbsp; Log in !
		                            </button>
		                        </div>
		                        <div className="pull-left">
		                            <h6>
		                                <a href="/signup" className="link" onClick={(e) => this.goToSignup(e)}>Create Account</a>
		                            </h6>
		                        </div>
		                    </form>
		                </div>
		            </div>
		        </div>
		    </div>
		)
	}
}

export default Login