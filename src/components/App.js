import '../assets/css/App.css'
import React from 'react'
import Navigation from './Navigation'
import VT from './VirusTotalAPI'
import CVE from './CveAPI'
import Shift from './ShiftComponent'
import OpCo from './OperationsCocktail'
class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedApp: null
    }
    this.chooseTemplate = this.chooseTemplate.bind(this)
    this.closeSelectedApp = this.closeSelectedApp.bind(this)
  }

  closeSelectedApp () {
    this.setState({
      selectedApp: null
    })
  }

  chooseTemplate (name) {
    let { closeSelectedApp } = this
    switch (name) {
      case 'Neutrino': this.setState({ selectedApp: <VT clickClose={closeSelectedApp} /> }); break
      case 'VirusTotal': this.setState({ selectedApp: <VT clickClose={closeSelectedApp} /> }); break
      case 'Cve': this.setState({ selectedApp: <CVE clickClose={closeSelectedApp} /> }); break
      case 'Shift': this.setState({ selectedApp: <Shift clickClose={closeSelectedApp} /> }); break
      case 'Convertion': this.setState({ selectedApp: <OpCo clickClose={closeSelectedApp} /> }); break
    }
  }

  render () {
    return (
      <div className='stem'>
        <Navigation onClickApp={this.chooseTemplate} />
        {this.state.selectedApp}
      </div>
    )
  }
}

export default App
