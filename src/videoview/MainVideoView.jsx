import React from "react"
import PinIcon from "mdi-react/PinIcon"
import PinOffIcon from "mdi-react/PinOffIcon"

class MainVideoView extends React.Component {
  componentDidMount = () => {
    const { stream } = this.props
    this.video.srcObject = stream
  }

  componentWillUnmount = () => {
    this.video.srcObject = null
  }

  render = () => {
    const { id, stream, vidFit, onPin, onUnpin, label } = this.props
    return (
      <div className="w-full max-w-full h-full max-h-full flex justify-center items-center relative">
        <video
          ref={(ref) => {
            this.video = ref
          }}
          id={id}
          autoPlay
          playsInline
          muted={false}
          className={"w-full h-auto max-h-full"}
        />
        <div className="absolute top-0 right-0 pt-2 w-full flex justify-center items-center">
          <span className="px-2 py-1 bg-indigo-900 rounded-md text-white inline-block bg-opacity-75">
            {label || stream.info.name}
          </span>
          {onPin && (
            <button
              className="w-6 h-6 bg-gray-800 bg-opacity-50 hover:bg-indigo-500 rounded flex items-center justify-center"
              onClick={onPin}
            >
              <PinIcon className="w-4 h-4 text-white" />
            </button>
          )}
          {onUnpin && (
            <button
              className="w-6 h-6 bg-red-500 bg-opacity-50 hover:bg-red-600 rounded flex items-center justify-center"
              onClick={onUnpin}
            >
              <PinOffIcon className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>
    )
  }
}

export default MainVideoView
