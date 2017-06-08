import React, { Component } from 'react'
import PropTypes from 'prop-types'

import background from '../img/header.jpg'

class Login extends Component {

	constructor(props){
		super(props)

		this.state = {
			error: ''
		}
	}

	componentDidMount(){
		 document.querySelector('#navigation').classList.add('navbar-transparent');
	}
	
	handleLogin = (e) => {
		e.preventDefault()
		const userData = {
			email: this.email.value,
			password: this.password.value
		}

		this.props.signIn(userData)
			.then((user) => {
				this.props.setUserState(user)
				this.context.router.history.goBack()
			})
			.catch(err => {
				switch(err.code){
					case 'auth/wrong-password':
						this.setState({error: 'The submitted password is incorrect !'})
						break;
					default:
						this.setState({error: err.message})
						break;
				}
			})
	}

	  static contextTypes = {
	    router: PropTypes.object
	  }

	goToSignup = (e) => {
		e.preventDefault()
		this.context.router.history.push('/signup')
	}

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