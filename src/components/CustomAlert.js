import React from 'react'

const Alert = (props) => {
  return (
    <div className='alert'>
      <span className='closebtn' onClick={props.clickCloseAlert}>{props.spanPseudoButtonClose}</span>
      <span className='okbtn' onClick={props.clickOkAlert}>{props.spanPseudoButtonOk}</span>
      <strong>{props.msgStrong}</strong> {props.actualMsg}
    </div>
  )
}

export default Alert
