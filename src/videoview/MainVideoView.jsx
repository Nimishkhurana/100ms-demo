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
    return (
      <div className="w-full max-w-full max-h-full flex justify-center items-center relative p-1">
          <video
          ref={ref => {
            this.video = ref;
          }}
          id={id}
          autoPlay
          playsInline
          muted={false}
          className={"w-full h-auto max-h-full rounded-lg"}
        />
        <div className="absolute top-0 right-0 pt-2 w-full text-center">
          <span className="px-2 py-1 bg-indigo-900 rounded-md text-white inline-block bg-opacity-75">{stream.info.name}</span>
        </div>
      </div>
    );
  };
}

export default MainVideoView;
