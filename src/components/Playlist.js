import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PlaylistItem from './PlaylistItem'
import SongForm from './SongForm'
import YouTubePlayer  from 'youtube-player'
import { base } from '../helpers/base'

import '../css/Playlist.css'

/**
 * ReactComponent Playlist
 * Rendering a playlist
 */
class Playlist extends Component {

	/**
	 * We need a state here
	 * @param  {Object} props 
	 */
	constructor(props){
		super(props)

		// The state here is very important
		this.state = {
			playlist: props.data || {}, // The informations about the playlist (title, description, songs ids, user informations ...)
			playing: false, // The song which is played right now
			showPlayer: false, // Showing player or not ?
			hiddenSongs: true, // Are there too many songs to be shown ?
			videoIndex: 0 // Index of the song played right now
		}

		// ChildrenItems are all the <PlaylistItem /> of the playlist
		this.childrenItems = []
	}

	/**
	 * Surfacing the Router
	 * @type {Object}
	 */
	static contextTypes = {
		router: PropTypes.object
	}

	/**
	 * Just to remove binding between Rebase and our State
	 */
	componentWillUnmount(){
		base.removeBinding(this.ref);
	}

	/**
	 * Handling several things when the component is mounted
	 */
	componentDidMount(){
		// Creating the YouTube player iFrame
		const player = YouTubePlayer(`${this.props.data.slug}-player`, {
			width: '100%',
			height: '200',
			playerVars: {
				autoplay: 0
			}
		});

		// Binding behaviors on every stateChange of the player
		player.on('stateChange', this.handleStateChange)

		// Populating our state here with the player, the playlist data (title, songs ids, user informations, ...)
		this.setState({
			player,
			playlist: this.props.data,
			hiddenSongs: this.props.data.songs && this.props.data.songs.length > 3
		});
		
		// Binding Rebase to our state for this playlist
		this.ref = base.syncState(`/playlists/${this.props.data.slug}`, {
			context: this,
			state: 'playlist'
		});
	}

	/**
	 * Will be called by <PlaylistItem /> so we can know what is now the playing item
	 * @param  {Object} data The informations about the song which is played
	 */
	setPlayingInformations = (data) => {
		const playlist        = this.state.playlist
		const playing         = this.state.playing
		playlist.informations = data.informations;

		if(playing){
			const currentPlaylistItem = this.childrenItems.filter(child => child.songId === playing).shift()
			currentPlaylistItem.item.clearProgressInterval();			
		}

		this.setState({playlist, playing: data.informations.id, videoIndex: data.index});
	}

	/**
	 * Handling every state change on the youtube player to apply it to our components (play, pause, end ...)
	 * @param  {YouTubeAPIEvent} state The changeState event from the YouTube Player
	 */
	handleStateChange = (state) => {
		// Identifying the current playlist item which is played
		const currentPlaylistItem = this.childrenItems.filter(data => data.songId === this.state.playing).shift()

		// Switch on the stateEvent data
		// - 0: Stopped
		// - 1: Playing
		// - 2: Paused
		// - 5: Ended
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
	      	if(nextPlaylistItem) nextPlaylistItem.item.playSong();
	        break;
	      default:
	        break;
	    }
	  }

	/**
	 * Registering <PlaylistItem /> children everytime they pop !
	 * @param  {int} index  The index of the child
	 * @param  {String} songId The YouTube Id of the child
	 * @param  {PlaylistItem} item   The <PlaylistItem />
	 */
	registerChild = (index, songId, item) => {
		this.childrenItems.push({index, songId, item});
	}

	/**
	 * Seek for a <PlaylistItem /> by YouTube video Id
	 * @param  {String} id YouTube video Id we are looking for
	 * @return {PlaylistItem}    The <PlaylistItem /> who carries this video
	 */
	getChildByVideoId = (id) => {
		return this.childrenItems.filter(data => data.songId === id).shift()
	}

	/**
	 * Adding song to the playlist
	 * @param  {String} id YouTube Video Id
	 */
	addSong = (id) => {
		const playlist = this.state.playlist;
		if(!playlist.songs) playlist.songs = [];
		playlist.songs.push(id);
		this.setState({playlist});
	}

	/**
	 * Removing a song from the playlist
	 * @param  {String} id YouTube Video id
	 */
	removeSong = (id) => {
		const currentPlaylistItem = this.getChildByVideoId(id) //this.childrenItems.filter(data => data.songId === this.state.playing).shift()
		if(currentPlaylistItem && currentPlaylistItem.songId === id){
			currentPlaylistItem.item.clearProgressInterval();
			const nextPlaylistItem = this.getChildByVideoId(currentPlaylistItem.index + 1) //this.childrenItems.filter(data => data.index === currentPlaylistItem.index + 1).shift()
			if(nextPlaylistItem) {
				this.state.player.cueVideoById(nextPlaylistItem.songId)
			};
		}
		const playlist = {...this.state.playlist}
		playlist.songs = playlist.songs.filter(song => song !== id);
		this.setState({playlist});
	}

	/**
	 * Handling the player visibility
	 */
	togglePlayer = () => {
		this.setState((prevState, props) => {
			return {showPlayer: !prevState.showPlayer}
		})
	}

	/**
	 * Handling the songs visibiliy
	 */
	toggleHidden = () => {
		this.setState({hiddenSongs: false})
	}

	/**
	 * Rendering all the <PlaylistItem /> 
	 * @return {JSX/HTML} Each song in our playlist become a <PlaylistItem /> component
	 */
	renderSongs(){
		const user = this.state.playlist.user
		const playlist = this.state.playlist
		if(playlist.songs){
			return playlist.songs.map((song, index) => {
				const hidden = index >= 3 && this.state.hiddenSongs && "hidden"
				const hr = index < playlist.songs.length - 1 && <hr/>
				return (
					<div key={song} className={`playlist-item ${hidden}`}>
						<PlaylistItem 
								key={song} 
								index={index}
								song={song} 
								isOwner={this.props.user && this.props.user.uid === user.uid}
								player={this.state.player}
								playing={this.state.playing}
								registerPlaying={this.setPlayingInformations}
								registerAsChild={this.registerChild}
								removeSong={this.removeSong}
							/>
						{hr}
					</div>
				)
			})
		} else {
			return (
				<div className="text-center">
					<h5>Add your first video to this playlist bro !</h5>
					<hr/>
				</div>
			)
		}
	}

	/**
	 * Rendering the Playlist component
	 * @return {JSX/HTML} The playlist template
	 */
	render(){
		const user = this.state.playlist.user
		const playlist = this.state.playlist
		const addSong = this.props.user.uid && this.props.user.uid === user.uid && <SongForm addSong={this.addSong} />

		return (
			<div className="col-xs-12 col-md-4">
				<div className="card playlist">
					<div className="header" data-background-color="orange">
						<h3 className="text-center">
							{playlist.title}
						</h3>
						<div className="row">
							<div className="col-5">
								<small><img src={user.avatar} alt={user.username} className="rounded-circle"/>
								&nbsp; {user.username}</small>
							</div>
							<div className="col-3">
								<small>{(playlist.songs && playlist.songs.length) || 0} videos</small>
							</div>
							<div className="col-4">
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
							{this.renderSongs()}
							{this.state.hiddenSongs && playlist.songs && (
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