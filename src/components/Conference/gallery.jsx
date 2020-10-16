import React, { useState, useEffect, useRef } from "react"
import { LocalVideoView, MainVideoView, SmallVideoView } from "../../videoview"
import ContainerDimensions from "react-container-dimensions"
import { largestRect } from "rect-scaler"
import VideoStreamMerger from "video-stream-merger"

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
  loginInfo,
}) => {
  const mergedVideoEl = useRef(null)
  const [mergedStream, setMergedStream] = useState(null)
  const [isPip, setPip] = useState(false)

  useEffect(() => {
    if (streams.length > 0) {
      const { width, height, rows, cols } = largestRect(
        960,
        540,
        streams.length,
        320,
        180
      ) // Force 16x9 sized videos
      const merger = new VideoStreamMerger({
        width: width * cols,
        height: height * rows,
      })

      streams.forEach(({ stream }, index) => {
        const x = width * (index % cols)
        const y = height * Math.floor(index / cols)
        console.log({ index, x, y })
        merger.addStream(stream, {
          x,
          y,
          width: width,
          height: height,
          mute: true,
        })
      })
      merger.start()
      setMergedStream(merger.result)
    } else {
      setMergedStream(null)
      setPip(false)
    }
  }, [streams, videoCount])

  useEffect(() => {
    console.log({ mergedStream })
    mergedVideoEl.current.srcObject = mergedStream
  }, [mergedStream])

  useEffect(() => {
    mergedVideoEl.current.addEventListener("leavepictureinpicture", () => {
      setPip(false)
    })
    mergedVideoEl.current.addEventListener("enterpictureinpicture", () => {
      setPip(true)
    })
  }, [])

  return (
    <>
      <div
        className={`absolute top-0 bottom-0 w-full flex flex-wrap justify-center items-center`}
        style={{ height: "calc(100vh - 128px)", backgroundColor: "#1a1619" }}
      >
        <ContainerDimensions>
          {({ width, height }) => {
            let w = "100%"
            let h = "100%"
            if (videoCount > 0) {
              let largestRectObj = largestRect(
                width,
                height,
                videoCount,
                160,
                90
              )
              w = largestRectObj.width
              h = largestRectObj.height
            }

            return (
              <>
                {localStream && (
                  <div style={{ height: h, width: w }}>
                    <LocalVideoView
                      id={id + "-video"}
                      label={`${loginInfo.displayName} (You)`}
                      client={client}
                      stream={localStream}
                      audioMuted={audioMuted}
                      videoMuted={videoMuted}
                      videoType="localVideo"
                      onPin={() => {
                        onPin(id + "-video")
                      }}
                    />
                  </div>
                )}
                {streams.map((item, index) => {
                  return (
                    <div key={item.mid} style={{ height: h, width: w }}>
                      <MainVideoView
                        id={item.mid}
                        stream={item.stream}
                        onPin={() => {
                          onPin(item.mid)
                        }}
                      />
                    </div>
                  )
                })}

                {localScreen && (
                  <div style={{ height: h, width: w }}>
                    <LocalVideoView
                      id={id + "-screen"}
                      label="Screen Sharing (You)"
                      client={client}
                      stream={localScreen}
                      audioMuted={false}
                      videoMuted={false}
                      videoType="localScreen"
                      onPin={() => {
                        onPin(id + "-screen")
                      }}
                    />
                  </div>
                )}
              </>
            )
          }}
        </ContainerDimensions>
      </div>
      <video
        className="opacity-0"
        ref={mergedVideoEl}
        playsInline
        autoPlay
        muted
      />
      {mergedStream && (
        <button
          className={`fixed bottom-0 right-0 m-2 py-1 px-2 rounded z-10 ${
            isPip ? "bg-red-500" : "bg-indigo-900"
          } text-white items-center justify-center flex`}
          onClick={() => {
            if (!isPip) {
              mergedVideoEl.current
                .requestPictureInPicture()
                .then(() => {
                  // setPip(true)
                })
                .catch(console.error)
            } else {
              document
                .exitPictureInPicture()
                .then(() => {
                  // setPip(false)
                })
                .catch(console.error)
            }
          }}
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </button>
      )}
    </>
  )
}

export { Gallery }
