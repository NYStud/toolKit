import React from 'react'
import appdata from '../data/AppList'

const Navigation = (props) => {
  return (
    <div className='navBar'>
      {appdata.map(item => <button key={item.id} className='menubtn' id={item.id} title={item.name} onClick={() => props.onClickApp(item.name)} />)}
    </div>
  )
}

export default Navigation
