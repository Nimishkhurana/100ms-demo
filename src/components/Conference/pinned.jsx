import React from "react"

const Pinned = props => {
  console.log(props)
  return (
    <div>Pinned. <button onClick={props.onUnpin}>Gallery mode</button></div>
  )
}

export {Pinned}