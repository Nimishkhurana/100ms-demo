import React from "react"
import { LocalVideoView, MainVideoView, SmallVideoView } from "../../videoview"

const Gallery = ({
  id,
  videoCount,
  client,
  localScreen,
  localStream,
  audioMuted,
  videoMuted,
  streams,
  onPin,
}) => {
  return (
    <div
      className={`conference-layout absolute top-0 bottom-0 w-full flex flex-wrap v${videoCount}`}
      style={{ height: "calc(100vh - 128px)", backgroundColor: "#1a1619" }}
    >
      {localStream && (
        <LocalVideoView
          id={id + "-video"}
          label="Local Stream"
          client={client}
          stream={localStream}
          audioMuted={audioMuted}
          videoMuted={videoMuted}
          videoType="localVideo"
          onPin={() => {
            onPin(id + "-video")
          }}
        />
      )}
      {streams.map((item, index) => {
        return (
          <MainVideoView
            key={item.mid}
            id={item.mid}
            stream={item.stream}
            onPin={() => {
              onPin(item.mid)
            }}
          />
        )
      })}

      {localScreen && (
        <LocalVideoView
          id={id + "-screen"}
          label="Screen Sharing"
          client={client}
          stream={localScreen}
          audioMuted={false}
          videoMuted={false}
          videoType="localScreen"
          onPin={() => {
            onPin(id + "-screen")
          }}
        />
      )}
      {/* <div className="small-video-list-div">
          <div className="small-video-list">
            {streams.map((item, index) => {
              return index > 0 ? (
                <SmallVideoView
                  key={item.mid}
                  id={item.mid}
                  stream={item.stream}
                  videoCount={streams.length}
                  collapsed={this.props.collapsed}
                  index={index}
                  onClick={this._onChangeVideoPosition}
                />
              ) : (
                <div />
              )
            })}
          </div>
        </div> */}
    </div>
  )
}

export { Gallery }
