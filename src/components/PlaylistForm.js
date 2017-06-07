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
			this.form.reset()
			this.context.router.history.push(`/playlists/${playlist.slug}`);
		});
	}

	cancelForm = (e) => {
		e.preventDefault()
		this.context.router.history.goBack()
	}

	render(){
		return (
			<section className="is-medium">
				<div className="container">
					<div className="columns">
						<div className="column is-6 is-offset-3">
							<h2 className="title">Create a new playlist</h2>
							<form onSubmit={(e) => this.savePlaylist(e)} ref={(form) => this.form = form}>
								<div className="field">
									<label htmlFor="title" className="label">Title</label>
									<p className="control">
										<input id="title" type="text" placeholder="Playlist title" className="input" ref={(input) => this.title = input} />
									</p>
								</div>
								<div className="field">
									<label htmlFor="description" className="label">Description</label>
									<p className="control">
										<textarea id="description" type="text" placeholder="Playlist description" className="textarea" ref={(input) => this.description = input}></textarea>
									</p>
								</div>
								<div className="field  is-grouped">
									<p className="control">
										<button type="submit" className="button is-primary">
											<i className="fa fa-save"></i>&nbsp;Save !
										</button>
									</p>
									<p className="control">
										<a className="button" onClick={(e) => this.cancelForm(e)}>
											Cancel
										</a>
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

export default PlaylistForm