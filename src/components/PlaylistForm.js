import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { slugify, getGravatar } from '../helpers/format'
import { base } from '../helpers/base'

class PlaylistForm extends Component {
	constructor(props){
		super(props)

		this.state = {
			informations: {}
		}
	}

	componentDidMount(){
		document.querySelector('#navigation').classList.remove('navbar-transparent');
	}

	static contextTypes = {
		router: PropTypes.object
	}

	savePlaylist = (e) => {
		e.preventDefault()
		
		const playlist = {
			slug: slugify(this.title.value),
			title: this.title.value,
			description: this.description.value,
			songs: [],
			informations: {},
			user: {
				uid: this.props.user.uid,
				username: this.props.user.username,
				slug: this.props.user.slug,
				avatar: getGravatar(this.props.user.email)
			}
		};
		base.post(`playlists/${playlist.slug}`, {
			data: playlist
		}).then(() => {
			this.cancelForm(e)
		});
	}

	cancelForm = (e) => {
		e.preventDefault()
		this.form.reset()
		document.querySelector('.playlist-create').classList.remove('show')
	}

	render(){
		return (
			<div className="container">
				<h5><i className="fa fa-youtube"></i> &nbsp;Create a new playlist</h5>
				<form className="form" onSubmit={(e) => this.savePlaylist(e)} ref={(form) => this.form = form}>
					<div className="form-group">
						
						<input id="title" type="text" placeholder="Type in playlist title" className="form-control" ref={(input) => this.title = input} />
					</div>
					<div className="form-group">
						
						<textarea id="description" type="text" placeholder="Type in playlist description" className="form-control" ref={(input) => this.description = input}></textarea>
					</div>
					<div className="form-group">
						<button type="submit" className="btn btn-success">
							<i className="fa fa-save"></i>&nbsp;Save !
						</button>
						<button className="btn btn-neutral" onClick={(e) => this.cancelForm(e)}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		)
	}
}

export default PlaylistForm