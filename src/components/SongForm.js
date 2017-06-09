import React, {Component} from 'react'

class SongForm extends Component {
  
  constructor(props){
    super(props)

    this.state = {
      error: ''
    }
  }

  addSong (event) {
    event.preventDefault()
    const youtubeURL = this.songURL.value
    const regexp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i
    if(regexp.test(youtubeURL)){
      const match = youtubeURL.match(regexp)
      const id		 = match[1]
      this.props.addSong(id)
      this.songForm.reset()
      this.setState({error: ''})
    } else {
      this.setState({error: 'Please type in a proper YouTube URL'})
    }
  }

  renderErrorNotification(){
    return this.state.error && (
        <div className="alert alert-warning">
          <div className="container">
            {this.state.error}
          </div>
        </div>
    )
  }

  render () {
    return (
      <form ref={(form) => this.songForm = form} onSubmit={(e) => this.addSong(e)}>
        <hr/>
        <div className="row">
          <div className="col-8">
            <div className='input-group form-group-no-border'>
              <span className="input-group-addon">
                <i className="fa fa-youtube"></i>
              </span>
              <input className='form-control' type='text' placeholder='Add a YouTube URL !' required ref={(input) => this.songURL = input} />
            </div>
          </div>
          <div className="col-2">
            <button type='submit' className='btn btn-info'>
				      <i className="fa fa-plus"></i>&nbsp; Add
				    </button>
          </div>
        </div>
        {this.renderErrorNotification()}
      </form>
    )
  }
}

export default SongForm
