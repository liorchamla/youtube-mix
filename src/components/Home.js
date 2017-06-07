import React, { Component } from 'react'
import PropTypes from 'prop-types'

import '../css/Home.css'

class Home extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  goToPlaylists = (e) => {
    e.preventDefault();
    this.context.router.history.push('/playlists');
  }

  render () {
    return (
      <section className='hero is-medium has-text-centered home'>
        <div className='hero-body'>
          <div className='container'>
            <h1 className='title'>YouTube Mix!</h1>
            <p>
              <i className='fa fa-youtube fa-5x' />
            </p>
            <h2 className='subtitle'>Create <strong>your own</strong> YouTube Playlists</h2>
            <a className='button is-large is-primary' href='/playlists' onClick={(e) => this.goToPlaylists(e)}>
              <i className='fa fa-eye' />&nbsp;
							Browse Playlists
						</a>
          </div>
        </div>
      </section>
    )
  }
}

export default Home
