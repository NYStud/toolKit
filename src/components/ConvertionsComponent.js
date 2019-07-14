import React, { Component } from 'react'

class ConCom extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  convert () {

  }

  render () {
    return (
      <div className='CVEContainer'>
        <textarea id='inputArea' />
        <textarea id='outputArea' />
        <button onClick={this.convert.bind(this)}>Convert</button>
      </div>
    )
  }
}
export default ConCom
