import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { base } from '../helpers/base'
import { slugify } from '../helpers/format'

class Signup extends Component {
	constructor(props){
		super(props)

		this.state = {
			error: ''
		}
	}
	static contextTypes = {
		router: PropTypes.object
	}

	handleSignup = (e) => {
		e.preventDefault()
		const userData = {
			email: "lchamla@gmail.com",
			password: "123456789"
		}

		this.props.signUpWithEmail(userData)
			.then(user => {
				const [name, slug] = [this.name.value, slugify(this.name.value)]
				base.post(`users/${user.uid}`, {
					data: {name: this.name.value, slug: slugify(this.name.value)}
				}).then(err => {
					if(!err){
						user.username = name
						user.slug = slug
						console.log(user);
						this.props.setUserState(user);
						this.context.router.history.push('/playlists')
					}
				})
			})
			.catch(err => {
				this.setState({error: err.message})
			})
	}

	render(){
		const errorNotification = this.state.error && <div className="notification is-danger">{this.state.error}</div>
		return (
			<section className="is-medium">
				<div className="container">
					<div className="columns">
						<div className="column is-6 is-offset-3">
							<button className="button" onClick={(e) => this.handleSignup(e)}>Test</button>
							<h2 className="subtitle">Register to YouTube Mix!</h2>
							{errorNotification}
							<form onSubmit={(e) => this.handleSignup(e)}>
								<div className="field">
									<label htmlFor="name" className="label">Username :</label>
									<p className="control">
										<input type="text" ref={(input) => this.name = input} className="input" required placeholder="Your dreamed nickname" value="Lior le chauve"/>
									</p>
								</div>
								<div className="field">
									<label htmlFor="email" className="label">Email address :</label>
									<p className="control">
										<input type="email" ref={(input) => this.email = input} className="input" required placeholder="Email address (future login)"/>
									</p>
								</div>
								<div className="field">
									<label htmlFor="password" className="label">Password :</label>
									<p className="control">
										<input type="password" ref={(input) => this.password = input} className="input" required placeholder="Password chosed with dignity !"/>
									</p>
								</div>
								<div className="field">
									<label htmlFor="password_confirm" className="label">Password confirmation :</label>
									<p className="control">
										<input type="password" ref={(input) => this.password_confirm = input} className="input" required placeholder="Password confirmation done right !"/>
									</p>
								</div>
								<div className="field">
									<p className="control">
										<button type="submit" className="button">Register !</button>
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

export default Signup