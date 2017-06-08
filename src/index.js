import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Redirect } from 'react-router-dom'
import { base, firebase } from './helpers/base'
import Home from './components/Home'
import Playlists from './components/Playlists'
import Playlist from './components/Playlist'
import Navigation from './components/Navigation'
import PlaylistForm from './components/PlaylistForm'
import Login from './components/Login'
import Signup from './components/Signup'

import './index.css'


class Main extends React.Component {

  constructor(props){
    super(props)

    this.firebase = firebase

    this.state = {
      user: {}
    }
  }

  componentWillMount(){
    this.firebase.auth().onAuthStateChanged(user => {
      if(user && user.uid){
        base.fetch(`/users/${user.uid}`, {
          context: this
        }).then(data => {
          user.username = data.name
          user.slug = data.slug
          this.setState({user});
        })
      }
    });
  }

  signInWithEmail = (userData) => {
    return this.firebase.auth().signInWithEmailAndPassword(userData.email, userData.password)
  }

  signOut = (router) => {
    this.firebase.auth().signOut()
    .then(() => {
      this.setState({user: {}})
      router.history.push('/')
    })
    .catch(function(err) {
      console.err(err)
    });
  }

  signUpWithEmail = (userData) => {
    return this.firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password)
  }

  setUserState = (user) => {
    this.setState({user})
  }

  render(){
    return (
      <HashRouter>
        <div>
          <Navigation user={this.state.user} isLoggedIn={this.state.user && this.state.user.uid} signOut={this.signOut} />
          <div className="wrapper">
            <Route exact path={`/`} render={() => <Home user={this.state.user} transparentNavigation={true} /> } />
            <Route exact path={`/playlists`} render={() => <Playlists user={this.state.user} />} />
            <Route exact path='/login' render={() => <Login user={this.state.user} signIn={this.signInWithEmail} setUserState={this.setUserState} />} />
            <Route exact path='/signup' render={() => <Signup user={this.state.user} signUpWithEmail={this.signUpWithEmail} setUserState={this.setUserState} />} />
          </div>
        </div>
      </HashRouter>
    )
  }
}


render(
  <Main />,
  document.getElementById('root')
)
