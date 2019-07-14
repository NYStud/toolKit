import React, { Component } from 'react'
import Summary from './Summary'
var UUID = require('uuid-js')
class Shift extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ticket: '',
      sumType: '',
      sumText: '',
      ticketsArray: [],
      ticketsInStorage: [],
      summaryWindow: ''
    }
  }

  componentDidMount () {
    this.loadTicketsFromStorage()
  }

  writeTicketsToTextfile (data) {
    // TODO
  }

  loadTicketsFromStorage () {
    let temp = JSON.parse(window.localStorage.getItem('Tickets'))
    if (temp !== null) {
      for (let i of temp) {
        if (i !== null) {
          this.setState(prevState => ({
            ticketsArray: [...prevState.ticketsArray, { 'uuid': i.uuid, 'sumtype': i.sumtype, 'sumtext': i.sumtext, 'sumticket': i.sumticket, 'date': i.date }]
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

  addTicket () {
    let uuid = UUID.create()
    let n = new Date()
    let y = n.getFullYear()
    let m = n.getMonth() + 1
    let d = n.getDate()
    let date = d + '/' + m + '/' + y

    let promise = new Promise(resolve => {
      resolve(this.setState(prevState => ({
        ticketsArray: [...prevState.ticketsArray, { 'uuid': uuid.hex, 'sumtype': this.state.sumType, 'sumtext': this.state.sumText, 'sumticket': this.state.ticket, 'date': date }]
      })))
    })
    promise.then(() => window.localStorage.setItem('Tickets', JSON.stringify(this.state.ticketsArray)))
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

  delete () {
    if (window.confirm('Are you sure?')) {
      var temp = [...this.state.ticketsArray]
      let alltrs = document.getElementsByClassName('ticketData')
      for (let i = 0; i < alltrs.length; i++) {
        if (alltrs[i].childNodes[0].checked === true) {
        //  this.removeFromStorage(alltrs[i].id)
          var index = temp.indexOf(alltrs[i].id)
          temp.splice(index, 1)
        }
      }
      let promise = new Promise(resolve => {
        resolve(this.setState({
          ticketsArray: temp
        }))
      })

      promise.then(() => window.localStorage.setItem('Tickets', JSON.stringify(this.state.ticketsArray)))
    } else {
      this.uncheckAllboxes()
    }
    this.uncheckAllboxes()
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
      for (let item of dateTds) {
        if (item.textContent === today || item.innerHTML === today) {
          dateArray.push(item.parentNode.childNodes[1].textContent + '-' + item.parentNode.childNodes[2].textContent + '.(' + item.parentNode.childNodes[3].textContent + ')\n')
          let tmpStr = ''
          dateArray.forEach(element => {
            tmpStr += element
            this.setState({
              summaryWindow: <Summary summaryTextArea={tmpStr} />
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

  render () {
    return (
      <div className='CVEContainer'>
        <textarea id='shiftSum2day' onChange={this.separateTicket.bind(this)} />
        <input type='text' className='search' id='search' onChange={this.search.bind(this)} />
        <button id='createSumBtn' onClick={this.addTicket.bind(this)}>Add ticket</button>
        <button id='deleteSelected' onClick={this.delete.bind(this)} >Delete Selected</button>
        <button id='exportTodaySum' onClick={this.export2DaysSummary.bind(this)} >Export Summary</button>
        <table id='table'>
          <tr>
            <th id='selectionTd'><input type='checkbox' className='ckbxm' id='selectAll' onChange={this.handleSelection.bind(this)} /></th>
            <th onClick={this.sortTicketType.bind(this, 0)}>Ticket Type</th>
            <th>Summary</th>
            <th>Ticket Number</th>
            <th>Date</th>
          </tr>
          {this.state.ticketsArray.filter(v => v !== null).map((element, index) =>
            <tr className='ticketData' id={element.uuid}><input type='checkbox' id={element.uuid} className='ckbx' /><td>{element.sumtype}</td>
              <td>{element.sumtext}</td><td>{element.sumticket}</td><td className='dateClass'>{element.date}</td></tr>
          )}
          <div id='summaryDiv'>
            {this.state.summaryWindow}
          </div>
        </table>
      </div>
    )
  }
}
export default Shift
