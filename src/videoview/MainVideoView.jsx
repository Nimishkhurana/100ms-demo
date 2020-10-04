import React from "react";

class MainVideoView extends React.Component {
  componentDidMount = () => {
    const { stream } = this.props;
    this.video.srcObject = stream;
  };

  componentWillUnmount = () => {
    this.video.srcObject = null;
  }

  render = () => {
    const { id, stream, vidFit } = this.props;
    const fitClass = vidFit ? "fit-vid" : ""
    return (
      <div className="mainwalavideo w-full max-w-full max-h-full flex justify-center items-center relative p-2">
        <video
          ref={ref => {
            this.video = ref;
          }}
          id={id}
          autoPlay
          playsInline
          muted={false}
          className={"w-full max-h-full max-w-full rounded-lg h-auto"}
        />
        <div className="main-video-name">
          <a className="main-video-name-a">{stream.info.name}</a>
        </div>
      </div>
    );
  };
}

export default MainVideoView;
