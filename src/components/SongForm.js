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
        <hr/>
        <div className="row">
          <div className="col-md-8">
            <div className='input-group form-group-no-border'>
              <span className="input-group-addon">
                <i className="fa fa-youtube"></i>
              </span>
              <input className='form-control' type='text' placeholder='Add a YouTube URL !' required ref={(input) => this.songURL = input} />
            </div>
          </div>
          <div className="col-md-2">
            <button type='submit' className='btn btn-info'>
				      <i className="fa fa-plus"></i>&nbsp; Add
				    </button>
          </div>
        </div>
      </form>
    )
  }
}

export default SongForm
