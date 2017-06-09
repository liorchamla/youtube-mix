import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PlaylistForm from './PlaylistForm'
import { getGravatar } from '../helpers/format'

/**
 * ReactComponent Navigation
 * Displaying the navbar on top of the website
 */
class Navigation extends Component {

  /**
   * We need a state here
   * @param  {Object} props
   */
  constructor(props){
    super(props)

    this.state = {
      user: props.user || {uid: ''}
    }
  }

  /**
   * Surfacing the Router
   * @type {Object}
   */
  static contextTypes = {
    router: PropTypes.object
  }

  /**
   * We need to set up easy access to the user
   */
  componentWillMount(){
    const user = this.props.user
    this.setState({user})
  }

  /**
   * Handling routing to any asked page
   * @param  {SyntheticEvent} event Any link click event
   * @param  {String} path The path we want to route on
   */
  goToPage(event, path){
    event.preventDefault()
    this.context.router.history.push(path)
  }

  /**
   * Handling click on the logout button
   * @param  {SyntheticEvent} e The click event
   */
  handleLogout = (e) => {
    e.preventDefault();
    this.props.signOut(this.context.router)
  }

  /**
   * Rendering the loggin button with a different behavior if the user is logged in
   * @return {JSX/HTML} The login/logout button
   */
  renderLogin = () => {
    if(!this.props.isLoggedIn) {
      return (
        <li className="nav-item">
          <a href="#!login" onClick={(e) => this.goToPage(e, '/login')} className="nav-link">
            <i className="fa fa-sign-in"></i> &nbsp;Login !
          </a>
        </li>
      )
    } else {
      return (
        <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#!" id="navbarDropdownMenuLink" data-toggle="dropdown">
                  <img className="img-account" alt={this.props.user.username} src={getGravatar(this.props.user.email)} />&nbsp; Account
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a className="dropdown-item" href="#!" onClick={(e) => this.handleLogout(e)}>Log out</a>
            </div>
        </li>
      )
    }
  }

  /**
   * Rendering the top navbar
   * @return {JSX/HTML} The navbar template
   */
  render () {
    // Rendering the Create Playlist button
    const createPlaylist = this.props.isLoggedIn ? (
      <li className="nav-item dropdown playlist-create">
          <a className="nav-link dropdown-toggle" href="#!" id="navbarDropdownMenuLink" data-toggle="dropdown">
            Create playlist
          </a>
          <div className="dropdown-menu playlist-form" aria-labelledby="navbarDropdownMenuLink">
            <PlaylistForm user={this.props.user} />
          </div>
      </li>)  : ''
    return (
      <nav id="navigation" className='navbar navbar-toggleable-md bg-primary fixed-top'>
        <div className="container">
          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-bar bar1"></span>
            <span className="navbar-toggler-bar bar2"></span>
            <span className="navbar-toggler-bar bar3"></span>
          </button>
        
          <a className='navbar-brand' href="#!" onClick={(e) => this.goToPage(e, '/')}>
			      YouTube Mix!
			    </a>
        

          <div className='collapse navbar-collapse justify-content-end'>
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className='nav-link' href='#!'  onClick={(e) => this.goToPage(e, '/')}>
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className='nav-link' href='#!'  onClick={(e) => this.goToPage(e, '/playlists')}>
                  Browse playlists
                </a>
              </li>
              {createPlaylist}
              {this.renderLogin()}
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navigation
