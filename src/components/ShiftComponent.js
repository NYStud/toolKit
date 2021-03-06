import React, { Component } from 'react'
import Summary from './Summary'
import Alert from './CustomAlert'
import ReactTooltip from 'react-tooltip'
var UUID = require('uuid-js')
const fse = require('fs-extra')
const { dialog } = require('electron').remote
class Shift extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ticket: '',
      sumType: '',
      sumText: '',
      ticketsArray: [],
      ticketsInStorage: [],
      summaryWindow: '',
      alertWindow: '',
      totalTickets: 0
    }
  }

  componentDidMount () {
    this.loadTicketsFromStorage()
  }

  componentWillUnmount () {
    let file = 'file.txt'
    fse.outputFile(file, JSON.stringify(window.localStorage), err => {
      console.log(err) // => null

      // fse.readFile(file, 'utf8', (err, data) => {
      //   if (err) return console.error(err)
      //   console.log(data) // => hello!
      // })
    })
    // (JSON.stringify(window.localStorage))
  }

  loadTicketsFromStorage () {
    let counter = 0
    let temp = JSON.parse(window.localStorage.getItem('Tickets'))
    if (temp !== null) {
      for (let i of temp) {
        if (i !== null) {
          counter++
          this.setState(prevState => ({
            ticketsArray: [...prevState.ticketsArray, { 'uuid': i.uuid, 'sumtype': i.sumtype, 'sumtext': i.sumtext, 'sumticket': i.sumticket, 'date': i.date }],
            totalTickets: counter
          }))
        }
      }
    }
  }

  separateTicket () {
    let txtAreaInput = document.getElementById('shiftSum2day').value
    let partsOfStr = txtAreaInput.split('-')
    this.setState({
      sumType: partsOfStr[0],
      sumText: partsOfStr[1],
      ticket: partsOfStr[2]
    })
  }

  uncheckAllboxes () {
    let alltrs = document.getElementsByClassName('ckbx')
    for (let i = 0; i < alltrs.length; i++) {
      alltrs[i].checked = false
    }
  }

  alertClose () {
    this.setState({
      alertWindow: ''
    })
    let sfdiv = document.getElementById('ShiftContainer2')
    let descendents = sfdiv.getElementsByTagName('*')
    for (let i = 0; i < descendents.length; i++) {
      descendents[i].setAttribute('style', 'pointer-events: auto; opacity:1;')
    }
  }

  componentDidUpdate () {
    let alert = document.getElementsByClassName('alert')
    let summary = document.getElementsByClassName('Summary')
    if (alert.length > 0 || summary.length > 0) {
      let sfdiv = document.getElementById('ShiftContainer2')
      let descendents = sfdiv.getElementsByTagName('*')
      for (let i = 0; i < descendents.length; i++) {
        descendents[i].setAttribute('style', 'pointer-events: none; opacity:0.4;')
      }
    }
  }

  createTicket () {
    let uuid = UUID.create()
    let n = new Date()
    let y = n.getFullYear()
    let m = n.getMonth() + 1
    let d = n.getDate()
    let date = d + '/' + m + '/' + y
    if (this.state.sumText.length < 4 || this.state.sumType.length < 4 || this.state.ticket.length < 4 || document.getElementById('shiftSum2day').value === '') {
      let msg = 'Needs ticket type, ticket summary and ticket number, in the form xxx-xxx-xxx'
      this.setState({
        alertWindow: <Alert msgStrong='Wrong Input! ' actualMsg={msg} clickCloseAlert={this.alertClose.bind(this)} spanPseudoButtonClose='&#x2717;' />
      })
    } else {
      let promise = new Promise(resolve => {
        resolve(this.setState(prevState => ({
          ticketsArray: [...prevState.ticketsArray, { 'uuid': uuid.hex, 'sumtype': this.state.sumType, 'sumtext': this.state.sumText, 'sumticket': this.state.ticket, 'date': date }],
          totalTickets: this.state.totalTickets + 1
        })))
      })
      promise.then(() => window.localStorage.setItem('Tickets', JSON.stringify(this.state.ticketsArray)))
    }
    document.getElementById('shiftSum2day').value = ''
  }

  addTicket () {
    this.createTicket()
  }

  search (e) {
    let input = e.target.value.toUpperCase()
    let tr = document.getElementsByClassName('ticketData')
    for (let i = 0; i < tr.length; i++) {
      let txtValue = tr[i].textContent || tr[i].innerText
      if (txtValue.toUpperCase().indexOf(input) > -1) {
        tr[i].style.display = ''
      } else {
        tr[i].style.display = 'none'
      }
    }
  }

  handleSelection (e) {
    let alltrs = document.getElementsByClassName('ckbx')
    if (e.target.checked === true) {
      for (let i = 0; i < alltrs.length; i++) {
        alltrs[i].checked = true
      }
    } else {
      for (let i = 0; i < alltrs.length; i++) {
        alltrs[i].checked = false
      }
    }
  }

  deleteProxy () {
    let alltrs = document.getElementsByClassName('ticketData')
    let checkIfChecked = false
    for (let i = 0; i < alltrs.length; i++) {
      if (alltrs[i].childNodes[0].childNodes[0].checked === true) {
        checkIfChecked = true
        break
      } else {
        checkIfChecked = false
      }
    }

    if (checkIfChecked === false) {
      this.setState({
        alertWindow: <Alert msgStrong='' actualMsg='Nothing selected!' clickCloseAlert={this.alertClose.bind(this)} spanPseudoButtonClose='&#x2717;'
        />
      })
    } else if (checkIfChecked === true) {
      this.setState({
        alertWindow: <Alert msgStrong='Delete! ' actualMsg='Are you sure you want to delete the selected?' clickCloseAlert={this.alertClose.bind(this)} spanPseudoButtonClose='&#x2717;'
          clickOkAlert={this.delete.bind(this)} spanPseudoButtonOk='&#x2713;' />
      })
    }
  }

  delete () {
    var temp = [...this.state.ticketsArray]
    let alltrs = document.getElementsByClassName('ticketData')
    for (let i = 0; i < alltrs.length; i++) {
      if (alltrs[i].childNodes[0].childNodes[0].checked === true) {
        //  var index = temp.indexOf(alltrs[i].childNodes[0].childNodes[0].id)
        console.log(alltrs[i].childNodes[0].childNodes[0].id)
        var elementPos = temp.map(function (x) { return x.uuid }).indexOf(alltrs[i].childNodes[0].childNodes[0].id)
        temp.splice(elementPos, 1)
      }
    }
    let promise = new Promise(resolve => {
      resolve(this.setState({
        ticketsArray: temp
      }))
    })

    promise.then(() => window.localStorage.setItem('Tickets', JSON.stringify(this.state.ticketsArray)))

    this.uncheckAllboxes()
    this.alertClose()
  }

  copySummary () {
    document.getElementById('copyBtnS').innerHTML = 'Copied!'
  }

  exitSummaryC () {
    this.setState({
      summaryWindow: ''
    })
    this.alertClose()
  }

  export2DaysSummary () {
    if (this.state.summaryWindow === '') {
      let date = new Date()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let year = date.getFullYear()
      let today = day + '/' + month + '/' + year
      let dateTds = document.getElementsByClassName('dateClass')
      let dateArray = []
      console.log(today)
      for (let item of dateTds) {
        console.log(item.innerHTML)
        if (item.textContent === today || item.innerHTML === today) {
          dateArray.push(item.parentNode.childNodes[1].textContent + '-' + item.parentNode.childNodes[2].textContent + '.(' + item.parentNode.childNodes[3].textContent + ')\n')
          let tmpStr = ''
          dateArray.forEach(element => {
            tmpStr += element
            this.setState({
              summaryWindow: <Summary summaryTextArea={tmpStr} copySummary={this.copySummary.bind(this)} exitSummary={this.exitSummaryC.bind(this)} />
            })
          })
        }
      }
    } else {
      this.setState({
        summaryWindow: ''
      })
    }
  }

  sortTicketType (n) {
    console.log(n)
    var table; var rows; var switching; var i; var x; var y; var shouldSwitch; var dir; var switchcount = 0
    table = document.getElementById('table')
    switching = true
    // Set the sorting direction to ascending:
    dir = 'asc'
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false
      rows = table.rows
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName('TD')[n]
        y = rows[i + 1].getElementsByTagName('TD')[n]
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir === 'asc') {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true
            break
          }
        } else if (dir === 'desc') {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true
            break
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
        switching = true
        // Each time a switch is done, increase this count by 1:
        switchcount++
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount === 0 && dir === 'asc') {
          dir = 'desc'
          switching = true
        }
      }
    }
  }

  importToStorage () {
    var input = document.createElement('input')
    input.type = 'file'

    input.onchange = e => {
      // getting a hold of the file reference
      var file = e.target.files[0]

      // setting up the reader
      var reader = new window.FileReader()
      reader.readAsText(file, 'UTF-8')

      // here we tell the reader what to do when it's done reading...
      reader.onload = readerEvent => {
        var content = readerEvent.target.result // this is the content!
        var data = JSON.parse(content)
        Object.keys(data).forEach(function (k) {
          window.localStorage.setItem(k, data[k])
        })
        window.location.reload()
      }
    }

    input.click()
  }

  importFromTxt () {
    let uuid = UUID.create()
    let n = new Date()
    let y = n.getFullYear()
    let m = n.getMonth() + 1
    let d = n.getDate()
    let date = d + '/' + m + '/' + y
    let chosenFiles = dialog.showOpenDialog()
    let splitLines = []
    let splitTickets = []
    let ticketnumber = ''
    fse.readFile(chosenFiles[0], 'utf8', (err, data) => {
      if (err) return console.error(err)
      splitLines = data.split('\n')
      splitLines.forEach(e => {
        splitTickets = e.split('-')
        ticketnumber = splitTickets[2].replace('(', '')
        ticketnumber = ticketnumber.replace(')', '')
        if (splitTickets[0] !== '') {
          if (splitTickets[0].length > 3 || splitTickets[1].length > 3 || splitTickets[2].length > 3) {
            uuid = UUID.create()
            let promise = new Promise(resolve => {
              resolve(this.setState(prevState => ({
                ticketsArray: [...prevState.ticketsArray, { 'uuid': uuid.hex, 'sumtype': splitTickets[0], 'sumtext': splitTickets[1], 'sumticket': ticketnumber, 'date': date }]
              })))
            })
            promise.then(() => window.localStorage.setItem('Tickets', JSON.stringify(this.state.ticketsArray)))
          }
        }
      })
    })
  }

  exportToTxt () {
    let chosenDirectory = dialog.showSaveDialog()
    let ticket = ''
    this.state.ticketsArray.forEach(e => {
      ticket += e.sumtype + '-' + e.sumtext + '-' + e.sumticket + '\n'
    })
    fse.outputFile(chosenDirectory, ticket, err => {
      console.log(err) // => null

      // fse.readFile(chosenDirectory, 'utf8', (err, data) => {
      //   if (err) return console.error(err)
      //   console.log(data) // => hello!
      // })
    })
  }
  exportStorageFile () {
    let chosenDirectory = dialog.showSaveDialog()
    let jsonFormat = JSON.stringify(window.localStorage)

    fse.outputFile(chosenDirectory, jsonFormat, err => {
      console.log(err)
    })
  }

  addWithEnter (e) {
    if (e.key === 'Enter') {
      this.createTicket()
      e.preventDefault()
    }
  }

  render () {
    return (
      <div className='ShiftContainer' >
        <div id='ShiftContainer2'>
          <button className='closeBtn' title='Close the component' id='closeBtn' onClick={this.props.clickClose} />
          <textarea data-tip data-for='shiftInfo' id='shiftSum2day' onKeyPress={this.addWithEnter.bind(this)} onChange={this.separateTicket.bind(this)} />
          <ReactTooltip id='shiftInfo' place='bottom' type='dark' effect='float'>
            <p>You can create tickets by adding a ticket type, a ticket summary and a ticket number (xxx-xxx-xxx),</p><p> example: Webproxy:please whitelist 9gag for me-Request NOT sent to proxy team!-234234534</p>
          </ReactTooltip>
          <button id='createSumBtn' title='Add a ticket' onClick={this.addTicket.bind(this)} />
          <button id='deleteSelected' title='Delete selected ticket/s' onClick={this.deleteProxy.bind(this)} />
          <button id='importToStorage' title='Import from storage file' onClick={this.importToStorage.bind(this)} />
          <button id='importFromTxt' title='Import tickets from text file' onClick={this.importFromTxt.bind(this)} />
          <button id='exportToTxt' title='Export tickets to text file' onClick={this.exportToTxt.bind(this)} />
          <button id='exportStorageFile' title='Export storage file manually' onClick={this.exportStorageFile.bind(this)} />
          <span id='totalTickets'><strong>Total tickets: {this.state.totalTickets}</strong></span>
          <button id='exportTodaySum' title='Export tickets from today' onClick={this.export2DaysSummary.bind(this)} />
          <input type='text' title='Search for anything' className='search' id='search' placeholder='Search' onChange={this.search.bind(this)} />
          <div className='tableDiv'>
            <table id='table'>
              <thead>
                <tr>
                  <th id='selectionTd'><input type='checkbox' className='ckbxm' id='selectAll' onChange={this.handleSelection.bind(this)} /></th>
                  <th id='typeth' onClick={this.sortTicketType.bind(this, 1)}>Ticket Type</th>
                  <th>Summary</th>
                  <th id='ticketnumth'>Ticket Number</th>
                  <th id='dateth' onClick={this.sortTicketType.bind(this, 4)} >Date</th>
                </tr>
              </thead>
              <tbody key='a'>
                {this.state.ticketsArray.filter(v => v !== null).map((element, index) =>
                  <tr className='ticketData' key={index + 'b'} id={element.uuid}><td><input type='checkbox' id={element.uuid} className='ckbx' /></td><td>{element.sumtype}</td>
                    <td>{element.sumtext}</td><td>{element.sumticket}</td><td className='dateClass'>{element.date}</td></tr>
                )}</tbody></table>
          </div>
        </div>
        <div id='summaryDiv'>
          {this.state.summaryWindow}
        </div>
        {this.state.alertWindow}
      </div>
    )
  }
}
export default Shift
