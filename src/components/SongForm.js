import React, {Component} from 'react'

class SongForm extends Component {
  addSong (event) {
    event.preventDefault()
    const youtubeURL = this.songURL.value
    const match = youtubeURL.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i)
    const id		 = match[1]
    this.props.addSong(id)
    this.songForm.reset()
  }

  render () {
    return (
      <form ref={(form) => this.songForm = form} onSubmit={(e) => this.addSong(e)}>
        <hr />
        <div className='field has-addons'>
          <p className='control is-expanded has-icons-left'>
            <input className='input' type='text' placeholder='Add a YouTube URL !' required ref={(input) => this.songURL = input} />
            <span className='icon is-small is-left'>
              <i className='fa fa-youtube' />
            </span>
          </p>
          <p className='control'>
            <button type='submit' className='button is-info'>
				      + Add
				    </button>
          </p>
        </div>
      </form>
    )
  }
}

export default SongForm
