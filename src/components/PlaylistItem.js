import React, { Component } from 'react';
import { getTimeRate, formatDuration } from '../helpers/format';

class PlaylistItem extends Component {
	constructor(props){
		super(props);

		this.state = {
			playing: false,
			progressValue: 0,
			paused: true,
			informations: {}
		}

		this.progressInterval = null;
		this.progressValue = 0;

		this.fetchSongInfos(props.song).then(richSong => {
		  this.setState({informations: richSong});
		});
	}



	fetchSongInfos = async (id) => {
	    let song = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${id}&key=AIzaSyBPBShIzTzRec5iwBl7FWqGWh83qYbr6hQ&part=snippet,contentDetails`)
	      .then(data => data.json())
	      .then(data => {
	        const richSong = {
	          id,
	          title: data.items[0].snippet.title,
	          thumbnail: data.items[0].snippet.thumbnails.default.url,
	          duration: formatDuration(data.items[0].contentDetails.duration) || 0
	        }

	        return richSong;
	      });
	    return song;
	  }

	playSong = () => {
	    if(this.state.playing === false || this.props.playing !== this.props.song){
	    	this.props.registerPlaying(this.state.informations)
	      	this.setState({playing: this.props.song})
	      	this.props.player.loadVideoById(this.props.song)
	    }
	    this.props.player.playVideo();
	    this.setState({paused: false});
	    this.progressInterval = window.setInterval(this.handleTimeRate, 500);
	}

	handleTimeRate = () => {
		getTimeRate(this.props.player).then(rate => {
			if(!isNaN(rate)) this.progress.value = rate;
		})
	}

	pause = () => {
		this.setState({paused: true})
		this.props.player.pauseVideo()
		this.clearProgressInterval();
	}

	clearProgressInterval = () => {
		window.clearInterval(this.progressInterval)
		this.progressInterval = null
	}

	componentDidUpdate(){
		if(this.props.playing !== this.props.song){
			this.clearProgressInterval();
			this.progress.value = 0;
		}
	}

	componentWillUnmout(){
		this.clearProgressInterval();
	}

	render(){
		const key = this.props.id;
		let button;
		if(!this.state.paused && this.props.playing === this.props.song) {
			button = <a className="button" onClick={(e) => this.pause()}>&#10074;&#10074;</a>;
		} else {
			button = <a className="button" onClick={(e) => this.playSong()}>&#9658;</a>;
		}

		return (
			<article className="media" key={key}>
				<figure className="media-left">
					<p className="image is-64x64">
						<img src={this.state.informations.thumbnail} alt={this.state.informations.title}/>
					</p>
				</figure>
				<div className="media-content">
					<p>
						{this.state.informations.title} 
					</p>
					<progress id={'progress-' + this.props.song} ref={(progress) => this.progress = progress} className="progress is-primary" value="0" max="100">0%</progress>
				</div>
				<div className="media-right">
					{button}
					<br />
					<a className="button" onClick={(e) => this.props.removeSong(this.props.song)}>
						<i className="fa fa-times"></i>
					</a>
				</div>
			</article>
		)
	}
}

export default PlaylistItem;