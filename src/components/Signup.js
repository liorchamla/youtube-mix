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

	componentDidMount(){
		document.querySelector('#navigation').classList.remove('navbar-transparent');
	}

	static contextTypes = {
		router: PropTypes.object
	}

	handleSignup = (e) => {
		e.preventDefault()
		const userData = {
			email: this.email.value,
			password: this.password.value
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
						this.props.setUserState(user);
						this.context.router.history.push('/playlists')
					}
				})
			})
			.catch(err => {
				console.log(err);
				this.setState({error: err.message})
			})
	}

	render(){
		const errorNotification = this.state.error && (
			<div className="alert alert-warning" role="alert">
                <div className="container">
                    {this.state.error}
                </div>
            </div>
		)
		return (
			<div className="section section-signup">
                <div className="container">
                    <div className="row">
                        <div className="card card-signup" data-background-color="orange">
                            <form className="form"  onSubmit={(e) => this.handleSignup(e)}>
                                <div className="header header-primary text-center">
                                    <h4 className="title title-up">Sign Up</h4>
                                    <div className="social-line" style={{display: 'none'}}>
                                        <a href="#pablo" className="btn btn-neutral btn-facebook btn-icon btn-icon-mini">
                                            <i className="fa fa-facebook-square"></i>
                                        </a>
                                        <a href="#pablo" className="btn btn-neutral btn-twitter btn-icon">
                                            <i className="fa fa-twitter"></i>
                                        </a>
                                        <a href="#pablo" className="btn btn-neutral btn-google btn-icon  btn-icon-mini">
                                            <i className="fa fa-google-plus"></i>
                                        </a>
                                    </div>
                                </div>
                                <div className="content">
									{errorNotification}
                                    <div className="input-group form-group-no-border">
                                        <span className="input-group-addon">
                                            <i className="now-ui-icons users_circle-08"></i>
                                        </span>
                                        <input type="text" ref={(input) => this.name = input} className="form-control" required placeholder="Your dreamed nickname" />
                                    </div>
                                    <div className="input-group form-group-no-border">
                                        <span className="input-group-addon">
                                            <i className="now-ui-icons ui-1_email-85"></i>
                                        </span>
                                        <input type="email" ref={(input) => this.email = input} className="form-control" required placeholder="Email address (future login)"/>
                                    </div>
                                    <div className="input-group form-group-no-border">
                                        <span className="input-group-addon">
                                            <i className="now-ui-icons ui-1_lock-circle-open"></i>
                                        </span>
                                        <input type="password" ref={(input) => this.password = input} className="form-control" required placeholder="Password chosed with dignity !"/>
                                    </div>
                                </div>
                                <div className="footer text-center">
                                    <button type="submit" className="btn btn-neutral btn-round btn-lg"><i className="fa fa-check"></i> Create Account</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
		)
	}
}

export default Signup