import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const Summary = (props) => {
  return (
    <div className='Summary'>
      <CopyToClipboard text={props.summaryTextArea}
      >

        <button id='copyBtnS' title='Copy' onClick={props.copySummary}>Copy</button>
      </CopyToClipboard>
      <textarea readOnly id='summaryTextAreaExport' value={props.summaryTextArea} />
      <button id='exitBtnS' title='Exit' onClick={props.exitSummary} />
    </div>
  )
}

export default Summary

{ /* <CopyToClipboard text={this.state.textToCopy}
onCopy={() => this.setState({ copied: true })}>
<button className='copyText' id='copyText' onClick={this.copyTextToClipBoard.bind(this)}>Copy</button>
</CopyToClipboard></div>} */ }
