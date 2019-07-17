import React, { Component } from 'react'
import JSONPretty from 'react-json-prettify'
import ReactTooltip from 'react-tooltip'
const request = require('request')
class CVE extends Component {
  constructor (props) {
    super(props)
    this.state = {
      reportStringApi: '',
      reportStringMitre: '',
      msbulettinId: '',
      cve: 'CVE-2019-9956',
      startedSearching: false
    }
  }

  windowsSecBulettin () {
    let link = 'http://cve.circl.lu/api/link/msbulletin.bulletin_id/' + this.state.msbulettinId
    let that = this
    request.get(link, function (error, response, body) {
      console.log('ERROR  ' + error)
      console.log('RESPONSE  ' + response)
      var result = JSON.parse(body)
      that.setState({
        msbulettinId: <JSONPretty json={result} padding={2} />
      })
    })
  }

  specificCVE () {
    let link = 'http://cve.circl.lu/api/cve/' + this.state.cve
    let that = this
    request.get(link, function (error, response, body) {
      console.log('ERROR  ' + error)
      console.log('RESPONSE  ' + response)
      var result = JSON.parse(body)
      that.setState({
        reportStringApi: <JSONPretty json={result} padding={2} />,
        startedSearching: true
      })
    })
  }

  alternativeCVEAPI () {
    let link = 'http://v1.cveapi.com/' + this.state.cve + '.json'
    let that = this
    request.get(link, function (error, response, body) {
      console.log('ERROR  ' + error)
      console.log('RESPONSE  ' + response)
      var result = JSON.parse(body)
      that.setState({
        reportStringMitre: <JSONPretty json={result} padding={2} />,
        startedSearching: true
      })
    })
  }

  validateAndKindaFixCVENum (str) {
    str = str.toUpperCase()
    console.log(str.length)
    if (str.length === 13 || str.length === 11 || str.length === 8 || str.length === 9) {
      if (str.length === 13) {
        if (str.substring(3, 4) === '-' && str.substring(8, 9) === '-') {
          if (str.substring(0, 3) === 'CVE') {
            console.log(str)
            return str
          } else {
            console.log('1')
            window.alert('Invalid CVE! eg.(cve-1234-5678) or (cve12345678)')
          }
        } else {
          console.log('2')
          window.alert('Invalid CVE! eg.(cve-1234-5678) or (cve12345678)')
        }
      } else if (str.length === 11) {
        if (str.substring(0, 3) === 'CVE') {
          let tempSub1 = str.substring(0, 3)
          let tempSub2 = str.substring(3, 7)
          let tempSub3 = str.substring(7, 11)
          str = tempSub1 + '-' + tempSub2 + '-' + tempSub3
          console.log(str)
          return str
        } else {
          console.log('3')
          window.alert('Invalid CVE! eg.(cve-1234-5678) or (cve12345678)')
        }
      } else if (str.length === 8) {
        if (!isNaN(str)) {
          str = 'CVE-' + str.substring(0, 4) + '-' + str.substring(4, 8)
          console.log(str)
        } else {
          console.log('4')
          window.alert('Invalid CVE! eg.(cve-1234-5678) or (cve12345678)')
        }
      } else if (str.length === 9) {
        let tempSub1 = str.substring(0, 4)
        let tempSub2 = str.substring(5, 9)
        if (!isNaN(tempSub1) && !isNaN(tempSub2)) {
          str = 'CVE-' + tempSub1 + '-' + tempSub2
          console.log(str)
          return str
        }
      } else {
        console.log('5')
        window.alert('Invalid CVE! eg.(cve-1234-5678) or (cve12345678)')
      }
    } else {
      console.log('6')
      window.alert('Invalid CVE! eg.(cve-1234-5678) or (cve12345678)')
    }
  }

  search () {
    let inputValue = document.getElementById('inputFieldCVE').value
    if (this.validateAndKindaFixCVENum(inputValue).substring(0, 3) === 'CVE') {
      this.specificCVE()
      this.alternativeCVEAPI()
    } else if (inputValue.substring(0, 2) === 'MS') {
      this.windowsSecBulettin()
    } else {
      window.alert('Something went wrong!')
    }
  }

  openTab (e) {
    let mitre = document.getElementById('mitre')
    let cveapi = document.getElementById('cveapi')
    if (e.target.id === 'cveapibtn') {
      cveapi.style.display = 'block'
      mitre.style.display = 'none'
    } else if (e.target.id === 'mitrebtn') {
      mitre.style.display = 'block'
      cveapi.style.display = 'none'
    }
  }
  render () {
    return (
      <div className='CVEContainer'>
        <button className='closeBtn' id='closeBtn' onClick={this.props.clickClose} />
        <input data-tip data-for='cveInfo' type='text' className='Input-text' placeholder='Search CVE' id='inputFieldCVE' />
        <button className='buggedBtnFML' id='cveBtn' onClick={this.search.bind(this)} />
        <ReactTooltip id='cveInfo' place='bottom' type='dark' effect='float'>
          <p>You can search for CVEs</p><p> or Microsoft vulnerabilities (CVE-xxxx-xxxx, MSxx-xxxx)</p>
        </ReactTooltip>
        {this.state.startedSearching && <div className='tab'>
          <button className='tablinks' id='cveapibtn' onClick={this.openTab.bind(this)} >CVE API</button>
          <button className='tablinks' id='mitrebtn' onClick={this.openTab.bind(this)} >MITRE</button>
        </div>}
        <div className='mitre' id='mitre'>{this.state.reportStringMitre}</div>
        <div className='cveapi' id='cveapi' >{this.state.reportStringApi}</div>
        <div className='msSecBulletin' id='msSecBulletin' >{this.state.msbulettinId}</div>
      </div>
    )
  }
}
export default CVE
