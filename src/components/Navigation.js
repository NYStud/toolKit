import React from 'react'

const Navigation = (props) => {
  return (
    <div className='navBar'>
      <button className='menubtn' id='neutrinoAPI' title='Neutrino' onClick={props.clickNeutrino} />
      <button className='menubtn' id='virusTotalAPI' title='VirusTotal' onClick={props.clickVT} />
      <button className='menubtn' id='cveAPI' title='CVE DBs' onClick={props.clickCVEAPI} />
      <button className='menubtn' id='shiftComponent' title='Shift' onClick={props.clickShiftSummaryComponent} />
    </div>
  )
}

export default Navigation
