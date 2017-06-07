import React, { Component } from 'react';
import './App.css';

import Playlist from './components/Playlist';
import YouTubePlayer from 'youtube-player';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      playing: null,
      paused: true
    }

    this.playlistItems = {};
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

  

  registerPlaying = (id) => {
    this.setState({playing: id});
  }

  registerPlaylistItem = (id, item) => {
    this.playlistItems[id] = item;
  }

  render() {
    return (
      <section className="App is-medium columns">
        <div className="column is-6 is-offset-3">
          <div className="card">
            <div id="player" className="card-image"></div>
            <Playlist 
              player={this.state.player} 
              playing={this.state.playing} 
              registerPlaying={this.registerPlaying}
              registerPlaylistItem={this.registerPlaylistItem}
            />
          </div>
        </div>
      </section>
    );
  }
}

export default App;
