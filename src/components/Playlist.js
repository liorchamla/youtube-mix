import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PlaylistItem from './PlaylistItem'
import SongForm from './SongForm'
import YouTubePlayer  from 'youtube-player'
import { base, firebase } from '../helpers/base'

import '../css/Playlist.css'


class Playlist extends Component {
	constructor(props){
		super(props)

		this.state = {
			playlist: {},
			playing: false
		}
	}

	static contextTypes = {
		router: PropTypes.object
	}

	componentWillMount(){
		this.ref = base.syncState(`/playlists/${this.context.router.route.match.params.playlistId}`, {
			context: this,
			state: 'playlist'
		});
	}

	componentWillUnmount(){
		base.removeBinding(this.ref);
	}

	componentDidMount(){
		const player = YouTubePlayer('player', {
			width: '100%',
			playerVars: {
				autoplay: 0
			}
		});
		player.on('stateChange', this.handleStateChange)
		this.setState({
			player
		});
	}

	setPlayingInformations = (data) => {
		const playlist = this.state.playlist;
		playlist.informations = data;
		this.setState({playlist, playing: data.id});
	}

	handleStateChange = (state) => {
	    switch(state.data){
	      case 1: // Playing
	        break;
	      case 2: // Pause
	        break;
	      case 0: // Ending
	        break;
	      default:
	        break;
	    }
	  }

	addSong = (id) => {
		const playlist = this.state.playlist;
		if(!playlist.songs) playlist.songs = [];
		playlist.songs.push(id);
		this.setState({playlist});
	}

	removeSong = (id) => {
		const playlist = this.state.playlist
		playlist.songs = playlist.songs.filter(song => song !== id);
		this.setState({playlist});
	}

	render(){
		const songs = (this.state.playlist.songs && this.state.playlist.songs.map((song, index) => {
			return <PlaylistItem 
						key={index} 
						index={index}
						song={song} 
						player={this.state.player}
						playing={this.state.playing}
						registerPlaying={this.setPlayingInformations}
						removeSong={this.removeSong}
					/>
		})) || <h2 className="subtitle">Add your first video to this playlist bro !</h2>;
		return (
			<section className="is-medium">
				<div className="container">
					<h1 className="title has-text-centered">
						{this.state.playlist.title}
					</h1>
					<div className="columns">
						<div className="column is-6 is-offset-3">
							<div className="card">
								<div id="player" className="card-image"></div>
								<div className="playlist">
									<div className="card-header  has-text-centered">
										<div className="card-header-title">
											Playing : {this.state.playing && this.state.playlist.informations.title}
										</div>
									</div>
									<div className="card-content">
										{songs}
										<SongForm addSong={this.addSong} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			
		)
	}
}

export default Playlist;