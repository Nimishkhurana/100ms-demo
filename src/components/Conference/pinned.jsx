import React from "react"
import { LocalVideoView, MainVideoView, SmallVideoView } from "../../videoview"

const Pinned = ({
  id,
  client,
  localScreen,
  localStream,
  audioMuted,
  videoMuted,
  streams,
  onUnpin,
  pinned,
}) => {
  console.log(pinned, streams)
  const isLocalScreenPinned = localScreen && pinned === id + "-screen"
  const isLocalStreamPinned = localStream && pinned === id + "-video"
  const pinnedStream = streams.filter((s) => s.sid === pinned)[0]
  const newStreams = streams.filter((s) => s.sid !== pinned)

  return (
    <div
      className={`absolute top-0 bottom-0 w-full flex items-center`}
      style={{ height: "calc(100vh - 128px)", backgroundColor:'#1a1619' }}
    >
      <div className="w-4/5">
        {isLocalStreamPinned && (
          <LocalVideoView
            id={id + "-video"}
            label="Local Stream"
            client={client}
            stream={localStream}
            audioMuted={audioMuted}
            videoMuted={videoMuted}
            videoType="localVideo"
            onUnpin={() => {
              onUnpin()
            }}
          />
        )}
        {isLocalScreenPinned && (
          <LocalVideoView
            id={id + "-screen"}
            label="Local Screen"
            client={client}
            stream={localScreen}
            audioMuted={audioMuted}
            videoMuted={videoMuted}
            videoType="localScreen"
            onUnpin={() => {
              onUnpin()
            }}
          />
        )}
        {pinnedStream && (
          <MainVideoView
            key={pinnedStream.mid}
            id={pinnedStream.mid}
            stream={pinnedStream.stream}
            onUnpin={onUnpin}
          />
        )}
      </div>
      <div className="w-1/5">
        {newStreams.map((item, index) => (
          <div key={`stream-${index}`} className="flex flex-col">
            <SmallVideoView key={item.mid} id={item.mid} stream={item.stream} />
          </div>
        ))}
        {localScreen && !isLocalScreenPinned && (
          <SmallVideoView
            id={id + "-screen"}
            stream={localScreen}
            label="local Screen"
          />
        )}
        {localStream && !isLocalStreamPinned && (
          <SmallVideoView
            id={id + "-video"}
            stream={localStream}
            label="local Stream"
          />
        )}
      </div>
    </div>
  )
}

export { Pinned }
