import React, { Component } from 'react'
class Parser extends Component {
  constructor (props) {
    super(props)
    this.state = {
      in: '',
      out: ''
    }
  }

  parse () {
    let test = document.getElementById('inputArea').value
    let firstvariable = '<System>'
    let secondvariable = '</System>'
    let result = test.match(new RegExp('(?:' + firstvariable + ')(.*?)(?:' + secondvariable + ')', 'ig'))
    console.log(result)
    this.setState({
      out: result[0]
    })
  }

  render () {
    return (
      <div className='ParserContainer'>
        <textarea id='inputArea' />
        <textarea value={this.state.out} id='outputArea' />
        <button onClick={this.parse.bind(this)}>Parse</button>
      </div>
    )
  }
}
export default Parser
