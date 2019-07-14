import React, { Component } from 'react'
import JSONPretty from 'react-json-prettify'
const request = require('request')
class CVE extends Component {
  constructor (props) {
    super(props)
    this.state = {
      reportStringApi: '',
      reportStringMitre: '',
      msbulettinId: '',
      cve: 'CVE-2019-9956'
    }
  }

  windowsSecBulettin () {
    let link = 'https://cors-anywhere.herokuapp.com/http://cve.circl.lu/api/link/msbulletin.bulletin_id/' + this.state.msbulettinId
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
    let link = 'https://cors-anywhere.herokuapp.com/http://cve.circl.lu/api/cve/' + this.state.cve
    let that = this
    request.get(link, function (error, response, body) {
      console.log('ERROR  ' + error)
      console.log('RESPONSE  ' + response)
      var result = JSON.parse(body)
      that.setState({
        reportStringApi: <JSONPretty json={result} padding={2} />
      })
    })
  }

  alternativeCVEAPI () {
    let link = 'https://cors-anywhere.herokuapp.com/http://v1.cveapi.com/' + this.state.cve + '.json'
    let that = this
    request.get(link, function (error, response, body) {
      console.log('ERROR  ' + error)
      console.log('RESPONSE  ' + response)
      var result = JSON.parse(body)
      that.setState({
        reportStringMitre: <JSONPretty json={result} padding={2} />
      })
    })
  }

  validateAndKindaFixCVENum () {
    let str = '20199956'
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

  render () {
    return (
      <div className='CVEContainer'>
        <button id='cveBtn' onClick={this.validateAndKindaFixCVENum} />
        {this.state.reportStringMitre}
      </div>
    )
  }
}
export default CVE
