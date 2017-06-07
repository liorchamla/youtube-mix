import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getGravatar } from '../helpers/format'


class Navigation extends Component {

  constructor(props){
    super(props)

    this.state = {
      user: props.user || {uid: ''}
    }
  }

  componentWillMount(){
    const user = this.props.user
    this.setState({user})
  }

  goToPage(event, path){
    event.preventDefault()
    this.context.router.history.push(path)
  }

  static contextTypes = {
    router: PropTypes.object
  }

  handleLogout = (e) => {
    e.preventDefault();
    this.props.signOut(this.context.router)
  }

  renderLogin = () => {
    if(!this.props.isLoggedIn) {
      return (
        <p className='control'>
          <a className='button' href="/login"  onClick={(e) => this.goToPage(e, '/login')}>
            <span className='icon'>
              <i className='fa fa-sign-in' />
            </span>
            <span>Login</span>
          </a>
        </p>
      )
    } else {
      return (
        <p className='control'>
          <button className='button' onClick={(e) => this.handleLogout(e)}>
            <figure className="image is-24x24" style={{marginRight: '8px', borderRadius: '50%', overflow: 'hidden'}}>
              <img src={getGravatar(this.props.user.email)} />
            </figure>
            <span>Logout</span>
          </button>
        </p>

      )
    }
  }

  render () {
    const createPlaylist = this.props.isLoggedIn ? <a className='nav-item' href='/playlist/create'  onClick={(e) => this.goToPage(e, '/playlist/create')}>Create playlist</a> : ''
    return (
      <nav className='nav'>
        <div className='nav-left'>
          <a className='nav-item' href="/" onClick={(e) => this.goToPage(e, '/')}>
			      YouTube Mix!
			    </a>
        </div>

        <span className='nav-toggle'>
          <span />
          <span />
          <span />
        </span>

        <div className='nav-right nav-menu'>
          <a className='nav-item' href='/'  onClick={(e) => this.goToPage(e, '/')}>
			      Home
			    </a>
          <a className='nav-item' href='/playlists'  onClick={(e) => this.goToPage(e, '/playlists')}>
			      Browse playlists
			    </a>
          {createPlaylist}
          <div className='nav-item'>
            <div className='field'>
              {this.renderLogin()}
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navigation
