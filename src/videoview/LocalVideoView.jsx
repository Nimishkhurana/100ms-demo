import React from "react"

class LocalVideoView extends React.Component {
  constructor() {
    super()
    this.state = {
      minimize: false,
    }
  }

  componentDidMount = () => {
    const { stream } = this.props
    this.video.srcObject = stream
  }

  componentWillUnmount = () => {
    this.video.srcObject = null
  }

  onMinimizeClick = () => {
    let minimize = !this.state.minimize
    this.setState({ minimize })
  }

  render = () => {
    const { id, label, audioMuted, videoMuted, videoType,onClick } = this.props

    let minIconStyle = "local-video-icon-layout"
    if (videoType == "localVideo") {
      minIconStyle = "local-video-min-layout"
    }

    return (
      <div
      onClick={onClick}
        className={`local-${
          videoType === "localVideo" ? "video" : "screen"
        }-container w-full max-w-full max-h-full flex justify-center items-center relative p-1 bg-black`}
      >
        <video
          ref={(ref) => {
            this.video = ref
          }}
          id={id}
          autoPlay
          playsInline
          muted={true}
          style={{ display: `${this.state.minimize ? "none" : ""}` }}
          className="w-full h-auto max-h-full rounded-lg"
        />
        <div
          className={`${
            this.state.minimize ? minIconStyle : "local-video-icon-layout"
          }`}
        ></div>
        <div className="absolute top-0 right-0 pt-2 w-full text-center">
          <span className="px-2 py-1 bg-indigo-900 rounded-md text-white inline-block bg-opacity-75">
            {label}
          </span>
        </div>
      </div>
    )
  }
}

export default LocalVideoView
