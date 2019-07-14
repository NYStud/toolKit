import '../assets/css/App.css'
import React from 'react'
import Navigation from './Navigation'
import VT from './VirusTotalAPI'
class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      neutrinoWindow: '',
      vtWindow: '',
      cveWindow: '',
      shiftSummaryWindow: ''
    }
  }

  launchNeutrino () {
    if (this.state.neutrinoWindow === '') {
      this.setState({
        neutrinoWindow: 'todo'
      })
    } else {
      this.setState({
        neutrinoWindow: ''
      })
    }
  }

  launchCve () {
    if (this.state.cveWindow === '') {
      this.setState({
        cveWindow: 'todo'
      })
    } else {
      this.setState({
        cveWindow: ''
      })
    }
  }

  launchShiftSummary () {
    if (this.state.shiftSummaryWindow === '') {
      this.setState({
        shiftSummaryWindow: 'todo'
      })
    } else {
      this.setState({
        shiftSummaryWindow: ''
      })
    }
  }

  launchVT () {
    if (this.state.vtWindow === '') {
      this.setState({
        vtWindow: <VT />
      })
    } else {
      this.setState({
        vtWindow: ''
      })
    }
  }

  render () {
    return (
      <div className='stem'>
        <Navigation clickNeutrino={this.launchNeutrino.bind(this)}
          clickVT={this.launchVT.bind(this)}
          clickCVEAPI={this.launchCve.bind(this)}
          clickShiftSummaryComponent={this.launchShiftSummary.bind(this)} />
        {this.state.neutrinoWindow}
        {this.state.vtWindow}
        {this.state.cveWindow}
        {this.state.shiftSummaryWindow}
      </div>
    )
  }
}

export default App
