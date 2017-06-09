import React, { Component } from 'react'
import PropTypes from 'prop-types'

import '../css/Home.css'
import background from '../img/header.jpg'

/**
 * ReactComponent Home 
 * Presents the website home page with a welcome text and a button to browse playlists
 */
class Home extends Component {
  /**
   * Surfacing the Router 
   * @type {Object}
   */
  static contextTypes = {
    router: PropTypes.object
  }

  /**
   * Managing the top navbar transparency
   */
  componentDidMount(){
    document.querySelector('#navigation').classList.add('navbar-transparent');
  }

  /**
   * Routing user to the playlists index
   * @param  {SyntheticEvent} e Click event
   */
  goToPlaylists = (e) => {
    e.preventDefault();
    this.context.router.history.push('/playlists');
  }

  /**
   * Rendering homepage
   * @return {JSX} The homepage template
   */
  render () {
    return (
      <div className="page-header clear-filter" data-filter-color="orange">
        <div className="page-header-image" data-parallax="true" style={{backgroundImage: `url(${background})`}}></div>
        <div className="container">
          <div className="content-center brand">
              <i className="fa fa-youtube" style={{marginBottom: '20px', fontSize: '10em'}}></i>
              <h1 className="h1-seo">YouTube Mix!</h1>
              <h3>A React App to create YouTube Playlists !</h3>
              <a href="#!" onClick={(e) => this.goToPlaylists(e)} className="btn btn-lg btn-neutral" style={{fontSize: '2em', marginBottom: '20px'}} >
                <i className="fa fa-headphones"></i>&nbsp; Browse playlists
              </a>
              <p>This has no utility, it is just a project to practice React, React Router, YouTube IFrame API and Firebase</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
