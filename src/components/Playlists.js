import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Playlist from './Playlist'
import playlists from '../samples/playlists.js'
import { base } from '../helpers/base'

import '../css/Playlist.css'

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

	componentDidMount(){
		document.querySelector('#navigation').classList.remove('navbar-transparent');
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
			return <Playlist user={this.props.user} data={this.state.playlists[key]} key={key} />
		})
		return (
			<div className="container page">
				<div className="row">
					{items}		
				</div>
			</div>
		)
	}
}

export default Playlists;