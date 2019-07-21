import React, { Component } from 'react'
import Loading from './loadingAnim'
import ReactTooltip from 'react-tooltip'
import { CopyToClipboard } from 'react-copy-to-clipboard'

// ===================== //
// IMPORT THE COMPONENT  //
// ===================== //
import JsonToTable from './jsontotable/JsonToTable'
const ipRegex = require('ip-regex')
const request = require('request')

class VT extends Component {
  constructor (props) {
    super(props)
    this.state = {
      key: 'd22fbaf1ea7371d8f1c33fe2df12b77c202497031550f91c1e2217b22ed1bdab',
      cors: 'https://cors-anywhere.herokuapp.com/',
      urlscan: 'https://www.virustotal.com/vtapi/v2/url/scan',
      urlreport: 'https://www.virustotal.com/vtapi/v2/url/report',
      urlDomainReport: 'https://www.virustotal.com/vtapi/v2/domain/report',
      ipreport: 'https://www.virustotal.com/vtapi/v2/ip-address/report',
      resource: '',
      URL: 'http://54.39.167.102/tftp',
      loadingDiv: '',
      responseURLscanArray: [],
      reportString: '',
      addpading: '',
      ipreportshow: false,
      textToCopy: ''
    }
  }

  componentDidMount () {

  }

  decider () {
    let button = document.getElementById('copyText')
    if (button != null) {
      button.textContent = 'Copy'
    }
    let input = document.getElementById('inputFieldVT').value
    if ((ipRegex({ exact: true }).test(input)) === true) {
      this.ipreport()
    } else if (input.substring(0, 4) === 'http') {
      this.scanURL()
    } else {
      this.domainReport()
    }
  }

  ipreport () {
    let that = this
    let link = this.state.ipreport + '?apikey=' + this.state.key + '&ip=' + document.getElementById('inputFieldVT').value
    request.get(link, function (error, response, body) {
      console.log(error)
      console.log(response)
      var result = JSON.parse(body)
      that.setState({
        reportString: <JsonToTable json={result} />,
        textToCopy: JSON.stringify(result, undefined, 2),
        ipreportshow: true
      })
    })
  }

  domainReport () {
    let that = this
    let link = this.state.urlDomainReport + '?apikey=' + this.state.key + '&domain=' + document.getElementById('inputFieldVT').value
    request.get(link, function (error, response, body) {
      console.log(error)
      console.log(response)
      var result = JSON.parse(body)
      that.setState({
        reportString: <JsonToTable json={result} />,
        textToCopy: JSON.stringify(result, undefined, 2),
        ipreportshow: true
      })
    })
  }

  scanURL () {
    let that = this
    let promise = new Promise(resolve => {
      resolve(this.postUrlScanRequest(), this.setState({
        loadingDiv: <Loading />
      }))
    })
    promise.then(() => setTimeout(function () {
      that.retrieveLatestPostUrlScan()
      that.setState({
        loadingDiv: ''
      })
    }, 5000))
  }

  retrieveLatestPostUrlScan () {
    let that = this
    let res = []
    let link = this.state.urlreport + '?apikey=' + this.state.key + '&resource=' + this.state.resource + '&allinfo=true'
    request.get(link, function (error, response, body) {
      console.log(error)
      console.log(response)
      var result = JSON.parse(body)
      let details = <div className='permalink' ><a href={result.permalink}>Permalink</a></div>
      let breaky = <div><br /></div>
      res.push(details)
      res.push(breaky)
      let counts = <div className='counts' >{'Total: ' + result.total + ', Positive: ' + result.positives}</div>
      res.push(counts)
      res.push(breaky)
      for (let key in result.scans) {
        if (result.scans[key].detected === true) {
          let resulto = <div className='res' ><div><strong>{key + ': '}</strong><span>{result.scans[key].result}</span></div></div>
          res.push(resulto)
        }
      }
      that.setState(prevState => ({
        responseURLscanArray: [...prevState.responseURLscanArray, res]
      }))
    })
    document.getElementById('responseArea').style = 'padding: 10px;'
  }

  postUrlScanRequest () {
    let that = this

    let params = { 'apikey': this.state.key, 'url': document.getElementById('inputFieldVT').value }
    request.post(this.state.urlscan, { form: params }, function (error, response, body) {
      console.log(error)
      console.log(response)
      var result = JSON.parse(body)
      that.setState({
        resource: result.scan_id,
        ipreportshow: false
      })
    })
  }

  copyTextToClipBoard () {
    document.getElementById('copyText').textContent = 'Copied!'
    let pre = document.getElementsByTagName('pre')
    console.log(pre)
    for (let i = 0; i < pre.length; i++) {
      this.setState({
        textToCopy: pre[i].innerText
      })
    }
  }

  render () {
    return (
      <div className='VTContainer'>
        <button className='closeBtn' id='closeBtn' onClick={this.props.clickClose} />
        <input data-tip data-for='vtinfo' type='text' className='Input-text' placeholder='Search VirusTotal' id='inputFieldVT' />
        <ReactTooltip id='vtinfo' place='bottom' type='dark' effect='float'>
          <p>You can search in VirusTotal for IPs,</p><p> URLs (including the http:// or https://) and domains (example.com)</p>
        </ReactTooltip>
        <button className='buggedBtnFML' id='vtsearchBtn'onClick={this.decider.bind(this)} />
        <div id='responseArea'>
          {this.state.responseURLscanArray.map((res, index) => {
            return res
          }
          )}
        </div>
        {this.state.ipreportshow && <div id='tableDiv'>
          {this.state.reportString}
          {this.state.loadingDiv}
          <CopyToClipboard text={this.state.textToCopy}
            onCopy={() => this.setState({ copied: true })}>
            <button className='copyText' id='copyText' onClick={this.copyTextToClipBoard.bind(this)}>Copy</button>
          </CopyToClipboard></div>}
      </div>
    )
  }
}
export default VT
