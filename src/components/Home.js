import React, { Component } from 'react'
import PropTypes from 'prop-types'

import '../css/Home.css'
import background from '../img/header.jpg'

class Home extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  componentDidMount(){
    document.querySelector('#navigation').classList.add('navbar-transparent');
  }

  goToPlaylists = (e) => {
    e.preventDefault();
    this.context.router.history.push('/playlists');
  }

  render () {
    return (
      <div className="page-header clear-filter" data-filter-color="orange">
        <div className="page-header-image" data-parallax="true" style={{backgroundImage: `url(${background})`}}></div>
        <div className="container">
          <div className="content-center brand">
              <i className="fa fa-youtube" style={{marginBottom: '20px', fontSize: '10em'}}></i>
              <h1 className="h1-seo">YouTube Mix!</h1>
              <h3>A React App to create YouTube Playlists !</h3>
              <a href="/playlists" onClick={(e) => this.goToPlaylists(e)} className="btn btn-lg btn-neutral" style={{fontSize: '2em'}} >
                <i className="fa fa-headphones"></i>&nbsp; Browse playlists
              </a>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
