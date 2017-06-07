import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Login extends Component {

	constructor(props){
		super(props)

		this.state = {
			error: ''
		}
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
			<div className="notification is-danger">
			  {this.state.error}
			</div>
		)
		return (
			<section className="is-medium">
				<div className="container">
					<div className="columns">
						<div className="column is-6 is-offset-3">
							<h2 className="subtitle">Log in bro !</h2>
							{errorNotification}
							<form onSubmit={(e) => this.handleLogin(e)}>
								<div className="field">
									<label htmlFor="email" className="label">Email address :</label>
									<p className="control">
										<input type="text" required id="email" className="input" placeholder="Email address" ref={(input) => this.email = input} />
									</p>
								</div>
								<div className="field">
									<label htmlFor="password" className="label">Password :</label>
									<p className="control">
										<input type="password" required id="password" className="input" placeholder="Password" ref={(input) => this.password = input} />
									</p>
								</div>
								<div className="field is-grouped">
									<p className="control">
										<button type="submit" className="button is-primary"><i className="fa fa-sign-in"></i>&nbsp;Login</button>
									</p>
									<p className="control">
										<button onClick={(e) => this.goToSignup(e)} className="button"><i className="fa fa-plus"></i>&nbsp;Register !</button>
									</p>
								</div>
							</form>
						</div>
					</div>
				</div>
			</section>
		)
	}
}

export default Login