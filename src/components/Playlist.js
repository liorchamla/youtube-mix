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
			playlist: props.data || {},
			playing: false,
			showPlayer: false,
			hiddenSongs: true,
			videoIndex: 0
		}

		this.childrenItems = []
	}

	static contextTypes = {
		router: PropTypes.object
	}

	componentWillMount(){
	}

	componentWillUnmount(){
		base.removeBinding(this.ref);
	}

	componentDidMount(){
		document.querySelector('#navigation').classList.remove('navbar-transparent');

		const player = YouTubePlayer(`${this.props.data.slug}-player`, {
			width: '100%',
			height: '200',
			playerVars: {
				autoplay: 0
			}
		});
		player.on('stateChange', this.handleStateChange)
		this.setState({
			player,
			playlist: this.props.data,
			hiddenSongs: this.props.data.songs.length > 3
		});
		
		this.ref = base.syncState(`/playlists/${this.props.data.slug}`, {
			context: this,
			state: 'playlist'
		});
	}

	setPlayingInformations = (data) => {
		const playlist = this.state.playlist;
		playlist.informations = data.informations;
		this.setState({playlist, playing: data.informations.id, videoIndex: data.index});
	}

	handleStateChange = (state) => {
		const currentPlaylistItem = this.childrenItems.filter(data => data.songId === this.state.playing).shift()
	    switch(state.data){
	      case 1: // Playing
	      	this.setState({paused: false})
	      	currentPlaylistItem.item.playSong();
	        break;
	      case 2: // Pause
	      	this.setState({paused: true})
	      	currentPlaylistItem.item.pause();
	        break;
	      case 0: // Ending
	      	const index = currentPlaylistItem.index + 1;
	      	currentPlaylistItem.item.pause();
	      	const nextPlaylistItem = this.childrenItems.filter(data => data.index === index).shift()
	      	nextPlaylistItem.item.playSong();
	        break;
	      default:
	        break;
	    }
	  }

	registerChild = (index, songId, item) => {
		this.childrenItems.push({index, songId, item});
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

	togglePlayer = () => {
		this.setState((prevState, props) => {
			return {showPlayer: !prevState.showPlayer}
		})
	}

	toggleHidden = () => {
		this.setState({hiddenSongs: false})
	}

	render(){
		const user = this.state.playlist.user
		const playlist = this.state.playlist
		const songs = (playlist.songs && playlist.songs.map((song, index) => {
			const hidden = index >= 3 && this.state.hiddenSongs && "hidden"
			const hr = index < playlist.songs.length - 1 && <hr/>
			return (
				<div key={index} className={`playlist-item ${hidden}`}>
					<PlaylistItem 
							key={index} 
							index={index}
							song={song} 
							player={this.state.player}
							playing={this.state.playing}
							registerPlaying={this.setPlayingInformations}
							registerAsChild={this.registerChild}
							removeSong={this.removeSong}
						/>
					{hr}
				</div>
			)
		})) || (
			<div className="text-center">
				<h5>Add your first video to this playlist bro !</h5>
				<hr/>
			</div>
		)


		const addSong = this.props.user.uid && this.props.user.uid === user.uid && <SongForm addSong={this.addSong} />

		return (
			<div className="col-xs-12 col-md-4">
				<div className="card playlist">
					<div className="header" data-background-color="orange">
						<h3 className="text-center">
							{playlist.title}
						</h3>
						<div className="row">
							<div className="col-md-5">
								<small><img src={user.avatar} alt={user.username} className="rounded-circle"/>
								&nbsp; {user.username}</small>
							</div>
							<div className="col-md-3">
								<small>{playlist.songs.length} videos</small>
							</div>
							<div className="col-md-4">
								<small>
								<div className="checkbox">
								    <input id={`${playlist.slug}-toggle-player`} type="checkbox" checked={this.state.showPlayer} onChange={(e) => this.togglePlayer(e)} ref={(input) => this.checkboxPlayer = input} />
								    <label htmlFor={`${playlist.slug}-toggle-player`}>
								        &nbsp;Player
								    </label>
								</div>
								</small>
							</div>
						</div>
					</div>
					<div className="card-block">
						<div style={{display: this.state.showPlayer? 'block' : 'none'}}>
							<div id={`${playlist.slug}-player`}></div>
							<hr/>
						</div>
						<div id={`${playlist.slug}-songs`} className="songs">
							{songs}
							{this.state.hiddenSongs && (
								<div className="text-center">
									<button className="btn btn-success btn-sm" onClick={() => this.toggleHidden()}>
										<i className="fa fa-eye"></i> &nbsp; {playlist.songs.length - 3} more videos ... &nbsp;
									</button>
								</div>
							)}
						</div>
						{addSong}
					</div>
				</div>
			</div>
		)
	}
}

export default Playlist;