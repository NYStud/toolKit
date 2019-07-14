import React from 'react'

const Summary = (props) => {
  return (
    <div className='Summary'>
      <button id='exitBtn' title='Exit' onClick={props.exit} />
      <button id='copyBtn' title='Copy' onClick={props.copySummary} />
      <textarea id='summaryTextArea' value={props.summaryTextArea} />
    </div>
  )
}

export default Summary
