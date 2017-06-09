import Rebase from 're-base'
import firebase from 'firebase'

const app = firebase.initializeApp({
  apiKey: 'AIzaSyA9WrEnrdUkQDYgG0LWYO--_8X40j9ymQc',
  authDomain: 'youtube-mix-83231.firebaseapp.com',
  databaseURL: 'https://youtube-mix-83231.firebaseio.com',
  projectId: 'youtube-mix-83231',
  storageBucket: 'youtube-mix-83231.appspot.com',
  messagingSenderId: '337753053108'
})

exports.base = Rebase.createClass(app.database())

exports.firebase = firebase
