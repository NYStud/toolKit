import React, { Component } from 'react'
import operations from '../data/operationsData'
const { dialog } = require('electron').remote
const fse = require('fs-extra')

class OpCo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedOperation: null,
      inputValue: '',
      outputValue: '',
      alertWindow: '',
      dumpString: null,
      saveLocation: null,
      chosenfile: null,
      wordsArray: null

    }
    this.createOperations = this.createOperations.bind(this)
    this.chooseOperation = this.chooseOperation.bind(this)
  }

  componentDidMount () {
    this.disableStartOPButton()
    this.disableOpenFileAction()
    this.disableSaveFileAction()
  }

  handleBase64 () {
    if (this.state.inputValue != null) {
      if (this.state.inputValue.match('^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$')) {
        let percentEncodedStr = window.atob(this.state.inputValue).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join('')
        this.setState({ outputValue: decodeURIComponent(percentEncodedStr) })
      } else {
        this.setState({ outputValue: window.btoa(this.state.inputValue) })
      }
    }
  }

  handleBinary () {
    let str = this.state.inputValue
    if (str != null) {
      str = str.replace(/\s+/g, '')
      if (str.match('^[01]+$')) {
        str = str.match(/.{1,8}/g).join(' ')
        let newBinary = str.split(' ')
        let binaryCode = []
        for (let i = 0; i < newBinary.length; i++) {
          binaryCode.push(String.fromCharCode(parseInt(newBinary[i], 2)))
        }
        this.setState({ outputValue: binaryCode.join('') })
      } else {
        this.setState({ outputValue: this.stringToBinary(this.state.inputValue) })
      }
    }
  }

  stringToBinary (str, spaceSeparatedOctets) {
    function zeroPad (num) {
      return '00000000'.slice(String(num).length) + num
    }

    return str.replace(/[\s\S]/g, function (str) {
      str = zeroPad(str.charCodeAt().toString(2))
      return !1 === spaceSeparatedOctets ? str : str + ' '
    })
  }

  openFile () {
    let chosenFiles = dialog.showOpenDialog()
    if (chosenFiles[0] != null) {
      this.setState({ chosenfile: chosenFiles[0] })
      return chosenFiles[0]
    }
  }

  handleOpenedFile () {
    if (this.state.selectedOperation != null) {
      switch (this.state.selectedOperation.id) {
        case 'hexdump': this.getDump(this.openFile()); break
      }
    }
  }

  getDump (file) {
    let buffer = fse.readFileSync(file)
    let lines = []
    let str = ''
    for (let i = 0; i < buffer.length; i += 16) {
      let address = i.toString(16).padStart(8, '0') // address
      let block = buffer.slice(i, i + 16) // cut buffer into blocks of 16
      let hexArray = []
      let asciiArray = []
      let padding = ''

      for (let value of block) {
        hexArray.push(value.toString(16).padStart(2, '0'))
        asciiArray.push(value >= 0x20 && value < 0x7f ? String.fromCharCode(value) : '.')
      }

      // if block is less than 16 bytes, calculate remaining space
      if (hexArray.length < 16) {
        let space = 16 - hexArray.length
        padding = ' '.repeat(space * 2 + space + (hexArray.length < 9 ? 1 : 0)) // calculate extra space if 8 or less
      }

      let hexString =
        hexArray.length > 8
          ? hexArray.slice(0, 8).join(' ') + '  ' + hexArray.slice(8).join(' ')
          : hexArray.join(' ')

      let asciiString = asciiArray.join('')
      let line = `${address}  ${hexString}  ${padding}|${asciiString}|`

      lines.push(line)
      str += asciiString
    }
    this.setState({ inputValue: lines.join('\n'),
      outputValue: str,
      dumpString: str })
    this.enableStartOPButton()
  }

  handleHexdump () {
    let str = this.state.dumpString
    str = str.split('.').join('')
    this.setState({ outputValue: str })
  }

  runOperation () {
    this.setState({
      outputValue: ''
    })

    if (this.state.selectedOperation != null) {
      switch (this.state.selectedOperation.id) {
        case 'hexdump': this.handleHexdump(); break
        case 'base64': this.handleBase64(); break
        case 'binary': this.handleBinary(); break
        case 'hex': this.handleHex(); break
        case 'url': this.handleURL(); break
        case 'csv2json': this.handleCsv2json(); break
        case 'json2csv': this.handleJson2csv(); break
      }
    }
  }

  handleFileToSave () {
    this.setState({ saveLocation: dialog.showSaveDialog() })
  }

  enableStartOPButton () {
    document.getElementById('startOperation').setAttribute('style', 'pointer-events: auto; opacity:1;')
  }

  enableOpenFileAction () {
    document.getElementById('openFile').setAttribute('style', 'pointer-events: auto; opacity:1;')
  }

  enableSaveFileAction () {
    document.getElementById('saveFile').setAttribute('style', 'pointer-events: auto; opacity:1;')
  }

  disableStartOPButton () {
    document.getElementById('startOperation').setAttribute('style', 'pointer-events: none; opacity:0.4;')
  }
  disableOpenFileAction () {
    document.getElementById('openFile').setAttribute('style', 'pointer-events: none; opacity:0.4;')
  }
  disableSaveFileAction () {
    document.getElementById('saveFile').setAttribute('style', 'pointer-events: none; opacity:0.4;')
  }

  chooseOperation (operation) {
    this.setState({
      selectedOperation: operation,
      inputValue: '',
      outputValue: ''
    })
    this.disableStartOPButton()
    switch (operation.id) {
      case 'hexdump': this.enableOpenFileAction(); this.enableSaveFileAction(); break
      case 'base64': this.enableSaveFileAction(); this.disableOpenFileAction(); break
      case 'binary': this.enableSaveFileAction(); this.disableOpenFileAction(); break
      case 'hex': this.enableSaveFileAction(); this.disableOpenFileAction(); break
      case 'url': this.enableSaveFileAction(); this.disableOpenFileAction(); break
      case 'csv2json': this.enableOpenFileAction(); this.enableSaveFileAction(); break
      case 'json2csv': this.enableOpenFileAction(); this.enableSaveFileAction(); break
    }
  }

  createOperations () {
    return operations.map((item, index) => {
      let { selectedOperation } = this.state
      let isSelected = selectedOperation ? selectedOperation.id === item.id : null
      return <span key={index} className={`operation ${isSelected ? 'selectedOperation' : null}`} id={item.id} onClick={() => this.chooseOperation(item)}>{item.name}</span>
    })
  }

  handleTextAreaChanges (e) {
    this.setState({ inputValue: e.target.value })
    if (e.target.value !== '') {
      this.enableStartOPButton()
    } else {
      this.disableStartOPButton()
    }
  }

  render () {
    let operations = this.createOperations()
    return (
      <div className='cocktailContainer'>
        <div id='containerContent'>
          <button className='closeBtn' title='Close the component' id='closeBtn' onClick={this.props.clickClose} />
          <div className='operations'>
            <span id='labelspan'>Operations</span>
            {operations}
          </div>
          <div className='iob'>
            <span id='labelspan'>Input</span><br />
            <textarea id='inputArea' value={this.state.inputValue} onChange={this.handleTextAreaChanges.bind(this)} /><br />
            <span id='labelspan'>Output</span><br />
            <textarea readOnly id='outputArea' value={this.state.outputValue} /><br />
          </div>
          <div className='actions'>
            <span id='labelspan'>Actions</span><br />
            <span className='action' id='startOperation' onClick={this.runOperation.bind(this)} >Go</span><br />
            <span className='action' id='openFile' onClick={this.handleOpenedFile.bind(this)}>Open a file</span>
            <span className='action' id='saveFile' onClick={this.handleFileToSave.bind(this)}>Save to file</span>
          </div>
        </div>
        {this.state.alertWindow}
      </div>
    )
  }
}
export default OpCo
