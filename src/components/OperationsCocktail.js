import React, { Component } from 'react'
import operations from '../data/operationsData'

class OpCo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hexdumpbool: false,
      base64bool: false,
      binarybool: false,
      hexbool: false,
      octalbool: false,
      urlbool: false,
      csv2jsonbool: false,
      json2csvbool: false,
      selectedOperation: null

    }
    this.createOperations = this.createOperations.bind(this)
    this.chooseOperation = this.chooseOperation.bind(this)
  }

  runOperation () {
    console.log(this.state.selectedOperation)
  }

  chooseOperation (operation) {
    this.setState({
      selectedOperation: operation
    })
  }

  createOperations () {
    return operations.map((item, index) => {
      let { selectedOperation } = this.state
      let isSelected = selectedOperation ? selectedOperation.id === item.id : null
      return <span key={index} className={`operation ${isSelected ? 'selectedOperation' : null}`} id={item.id} onClick={() => this.chooseOperation(item)}>{item.name}</span>
    })
  }

  render () {
    let operations = this.createOperations()
    return (
      <div className='cocktailContainer'>
        <button className='closeBtn' title='Close the component' id='closeBtn' onClick={this.props.clickClose} />
        <div className='operations'>
          <span id='labelspan'>Operations</span>
          {operations}
        </div>
        <div className='iob'>
          <span id='labelspan'>Input</span><br />
          <textarea id='inputArea' /><br />
          <span id='labelspan'>Output</span><br />
          <textarea id='outputArea' /><br />
        </div>
        <div className='actions'>
          <span id='labelspan'>Actions</span><br />
          <span id='action' onClick={this.runOperation.bind(this)} >Go</span><br />
          <span id='action'>Open a file</span>
          <span id='action'>Save to file</span>
        </div>
      </div>
    )
  }
}
export default OpCo
