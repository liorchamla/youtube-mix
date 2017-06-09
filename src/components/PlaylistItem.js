import React, { Component } from 'react';
import { getTimeRate, formatDuration, formatTime } from '../helpers/format';

class PlaylistItem extends Component {
	constructor(props){
		super(props);

		this.state = {
			playing: false,
			progressValue: 0,
			paused: true,
			informations: {}
		}

		this.progressInterval = null
		this.progressValue = 0
		this.progressClicked = false

		this.fetchSongInfos(props.song).then(richSong => {
		  this.setState({informations: richSong})
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
	    	document.title = `Now playing : ${this.state.informations.title} - YouTube Mix!`
	    	this.props.registerPlaying({informations: this.state.informations, index: this.props.index})
	      	this.setState({playing: this.props.song})
	      	this.props.player.loadVideoById(this.props.song)
	    }
	    this.props.player.playVideo();
	    this.setState({paused: false});
	    if(!this.progressInterval){
		    this.progressInterval = window.setInterval(this.handleTimeRate, 1000);
	    }
	}

	handleTimeRate = () => {
		getTimeRate(this.props.player).then(data => {
			if(!isNaN(data.rate)) this.progress.style.width = data.rate + '%';
			if(!isNaN(data.duration) && !isNaN(data.currentTime)) this.progressTime.innerHTML = `${formatTime(data.currentTime)} / ${formatTime(data.duration)}`
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

	componentDidMount(){
		this.props.registerAsChild(this.props.index, this.props.song, this)
	}

	componentWillUnmount(){
		this.clearProgressInterval();
	}

	renderPlayPauseButton(){
		if(!this.state.paused && this.props.playing === this.props.song) {
			return <button className="btn btn-neutral" onClick={(e) => this.pause()}>
				<i className="fa fa-pause"></i>
			</button>;
		} else {
			return <button className="btn btn-neutral" onClick={(e) => this.playSong()}>
				<i className="fa fa-play"></i>
			</button>;
		}
	}

	handleProgressBarClick = (e, seekAhead) => {
		if(this.progressClicked){
			const rate = (e.nativeEvent.offsetX / e.currentTarget.offsetWidth)
			this.props.player.getDuration().then(duration => {
				this.progress.style.width = rate * 100 + '%'
				this.progressTime.innerHTML = `${formatTime(rate * duration)} / ${formatTime(duration)}`
				this.props.player.seekTo(Math.floor(duration * rate))
			})
		}
	}

	renderProgressBarHTML(){
		return this.props.playing !== this.props.song ? '' : (
			<div className="progress-container progress-info">
			    <span className="progress-badge">Now playing</span>
			    <div className="progress" onMouseOut={(e) => this.progressClicked = false} onMouseDown={(e) => this.progressClicked = true} onMouseUp={(e) => this.progressClicked = false} onMouseMove={(e) => this.handleProgressBarClick(e, true)} >
			        <div className="progress-bar" id={'progress-' + this.props.song} ref={(progress) => this.progress = progress} role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
			            <span className="progress-value" ref={(span) => this.progressTime = span}></span>
			        </div>
			    </div>
			</div>
		)
	}

	renderDeleteButton(){
		return !this.props.isOwner ? '' : (
			<button className="btn btn-neutral" onClick={(e) => this.props.removeSong(this.props.song)}>
				<i className="fa fa-times"></i>
			</button>
		)
	}

	render(){
		const key = this.props.id;

		return (
			<div key={key} className="row">
				<div className="col-2">
					<img className="img-responsive img-raised" src={this.state.informations.thumbnail} alt={this.state.informations.title}/>
				</div>
				<div className="col-8 song-title">
					{this.state.informations.title && this.state.informations.title} 
					{this.renderProgressBarHTML()}
				</div>
				<div className="col-2">
					{this.renderPlayPauseButton()}
					<br />
					{this.renderDeleteButton()}
				</div>
			</div>
		)
	}
}

export default PlaylistItem;