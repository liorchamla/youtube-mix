import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlaylistForm from './PlaylistForm'
import playlists from '../samples/playlists.js'
import { base } from '../helpers/base'

class Playlists extends Component {
	constructor(props){
		super(props);

		this.state = {
			showForm: false
		};
	}

	componentWillMount(){
		this.ref = base.syncState('/playlists', {
			context: this,
			state: 'playlists'
		});
	}

	componentWillUnmount(){
		base.removeBinding(this.ref);
	}

	static contextTypes = {
		router: PropTypes.object
	}

	loadPlaylists = () => {
		this.setState({playlists})
	}

	goToPlaylist = (e, key) => {
		e.preventDefault()
		this.context.router.history.push(`/playlists/${key}`)
	}

	showForm = () => {
		this.setState({showForm: true})
	}

	hideForm = () => {
		this.setState({showForm: false})
	}

	savePlaylist = (data) => {
		const playlists = this.state.playlists;
		playlists[data.slug] = data;
		this.setState({showForm: false, playlists});
	}

	render(){
		const items = this.state.playlists && Object.keys(this.state.playlists).map(key => {
			const item = this.state.playlists[key]
			return (
				<div className="column" key={key}>
					<h1 className="title">{item.title}</h1>
					<h2 className="subtitle">{(item.songs && item.songs.length) || 0} videos</h2>
					<p className="content">{item.description && item.description.split(' ').slice(0, 10).concat(['...']).join(' ')}</p>
					<a onClick={(e) => this.goToPlaylist(e, key)} href={`/playlists/${key}`} className="button"><i className="fa fa-headphones"></i>&nbsp; Listen Now !</a>
				</div>
			);
		})
		return (
			<section className="is-medium">
				<div className="container">
					<div>
						<div className="columns">
							{items}		
						</div>
						<button className="button" onClick={() => this.loadPlaylists()}>Load test playlists</button>&nbsp;
					</div>
				</div>
			</section>
		)
	}
}

export default Playlists;