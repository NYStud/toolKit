import '../assets/css/App.css'
import React from 'react'
import Navigation from './Navigation'
import VT from './VirusTotalAPI'
import CVE from './CveAPI'
import Shift from './ShiftComponent'
class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      neutrinoWindow: '',
      vtWindow: '',
      cveWindow: '',
      shiftSummaryWindow: '',
      neutrinoShowing: false,
      vtshowing: false,
      cveshowing: false,
      shiftsummaryShowing: false
    }
  }

  launchNeutrino () {
    if (this.state.neutrinoWindow === '') {
      this.setState({
        neutrinoShowing: true,
        vtshowing: false,
        cveshowing: false,
        shiftsummaryShowing: false,
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
        neutrinoShowing: false,
        vtshowing: false,
        cveshowing: true,
        shiftsummaryShowing: false,
        cveWindow: <CVE clickClose={this.closeSelectedApp.bind(this)} />
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
        neutrinoShowing: false,
        vtshowing: false,
        cveshowing: false,
        shiftsummaryShowing: true,
        shiftSummaryWindow: <Shift clickClose={this.closeSelectedApp.bind(this)} />
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
        neutrinoShowing: false,
        vtshowing: true,
        cveshowing: false,
        shiftsummaryShowing: false,
        vtWindow: <VT clickClose={this.closeSelectedApp.bind(this)} />
      })
    } else {
      this.setState({
        vtWindow: ''
      })
    }
  }

  closeSelectedApp () {
    this.setState({
      neutrinoWindow: '',
      vtWindow: '',
      cveWindow: '',
      shiftSummaryWindow: ''
    })
  }

  render () {
    return (
      <div className='stem'>
        <Navigation clickNeutrino={this.launchNeutrino.bind(this)}
          clickVT={this.launchVT.bind(this)}
          clickCVEAPI={this.launchCve.bind(this)}
          clickShiftSummaryComponent={this.launchShiftSummary.bind(this)} />
        {this.state.neutrinoShowing && this.state.neutrinoWindow}
        {this.state.vtshowing && this.state.vtWindow}
        {this.state.cveshowing && this.state.cveWindow}
        {this.state.shiftsummaryShowing && this.state.shiftSummaryWindow}
      </div>
    )
  }
}

export default App
