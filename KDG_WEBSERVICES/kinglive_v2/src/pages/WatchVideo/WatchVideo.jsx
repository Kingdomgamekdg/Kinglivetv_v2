import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import '../../assets/scss/watchlive.scss'
// import avatarDefaultSVG from '../../assets/svg/avatarDefault.svg'
import coverDefaultJPG from '../../assets/svg/coverDefault.jpg'
import shareSVG from '../../assets/svg/share.svg'
import callAPI from '../../axios'
import ButtonFollow from '../../components/ButtonFollow'
import VideoPlayer from '../../components/VideoPlayer'
import { STORAGE_DOMAIN } from '../../constant'
import convertDateAgo from '../../helpers/convertDateAgo'

export default function WatchVideo() {
  const history = useHistory()
  const userRedux = useSelector(state => state.user)

  const chatListRef = useRef()

  const [videoData, setVideoData] = useState({})
  const user = useMemo(() => videoData.user, [videoData])
  // const [chatData, setChatData] = useState([])
  const [liveList, setLiveList] = useState([])
  // const [commentList, setCommentList] = useState([])
  const [isFollow, setIsFollow] = useState(false)

  const [hideChat, setHideChat] = useState(false)
  const [hideLive, setHideLive] = useState(false)
  // const [hideRecommend, setHideRecommend] = useState(false)

  const id = new URLSearchParams(window.location.search).get('v')

  // Get Current Video
  useEffect(() => {
    if (!id) return history.push('/')
    ;(async () => {
      try {
        const res = await callAPI.get(`/video?sid=${id}`)
        console.log({ videoData: res })
        setVideoData(res.data)

        // Check Follow Yet
        if (res.is_followed) {
          setIsFollow(true)
        } else {
          setIsFollow(false)
        }
      } catch (error) {
        console.log('error get video', error)
      }
    })()
  }, [id, history])

  // Get History Chat of Video
  // useEffect(() => {
  //   ;(async () => {
  //     try {
  //       const res = await callAPI.get(`/chats?stream=${id}`)
  //       console.log({ chatData: res })
  //       setChatData(res.data)
  //     } catch (error) {
  //       console.log('error get chat', error)
  //     }
  //   })()

  //   const handleReceiveChat = chatItem => setChatData(_chatData => [..._chatData, chatItem])
  //   socket.on('chat', handleReceiveChat)

  //   return () => {
  //     socket.removeEventListener('chat', handleReceiveChat)
  //   }
  // }, [id])

  // Get Live List
  useEffect(() => {
    ;(async () => {
      try {
        const res = await callAPI.get('/streammings')
        console.log({ liveList: res })
        setLiveList(res.data)
      } catch (error) {
        console.log('error get live list', error)
      }
    })()
  }, [])

  // Get Comment List
  // useEffect(() => {
  //   ;(async () => {
  //     try {
  //       const res = await callAPI.get(`/comment?video=${videoData._id}`)
  //       console.log({ commentList: res })
  //       setCommentList(res.data)
  //     } catch (error) {
  //       console.log('Error get comment list', error)
  //     }
  //   })()
  // }, [videoData])

  // Follow and Unfollow
  const handleFollow = async () => {
    try {
      const res = await callAPI.post(`follow?id=${user?._id}`)
      if (res.status === 1) setIsFollow(x => !x)
    } catch (error) {
      console.log('error follow or unfollow', error)
    }
  }

  return (
    <div className='watchlive'>
      <div className='watchlive__left'>
        <VideoPlayer guid={videoData.guid} />

        <div className='watchlive__titleVideo'>{videoData.name}</div>

        <div className='mb-30'>
          <span>
            {videoData.views} views • {convertDateAgo(videoData.create_date)} |{' '}
          </span>
          <span className='button-share'>
            <img src={shareSVG} alt='' />
            Share
          </span>
        </div>

        <div className='watchlive__infoVideo'>
          <div>
            <img src={`${STORAGE_DOMAIN}${user?.kyc.avatar.path}`} alt='' />
          </div>

          <div style={{ position: 'relative' }}>
            <div>
              {user?.kyc.first_name || user?.kyc.last_name
                ? `${user?.kyc.first_name} ${user?.kyc.last_name}`
                : 'Username'}
            </div>
            <div>{user?.kinglive.total_follower} followers</div>
            <div>{videoData.description}</div>

            {userRedux?._id !== user?._id && (
              <div style={{ position: 'absolute', top: 0, right: 0 }}>
                <ButtonFollow isFollow={isFollow} handleFollow={handleFollow} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='watchlive__right'>
        <div className='watchlive__chatContainer'>
          <div className={`${hideChat ? 'hide' : ''}`}>
            <div ref={chatListRef} className='watchlive__chatList'>
              {/* {chatData.map(chatItem => (
                <div key={chatItem._id} className='watchlive__chatItem'>
                  <div>
                    <img
                      src={
                        chatItem.user.kyc.avatar
                          ? `${STORAGE_DOMAIN}${chatItem.user.kyc.avatar.path}`
                          : avatarDefaultSVG
                      }
                      alt=''
                    />
                  </div>

                  <div>
                    <span>
                      {chatItem.user.kyc.first_name || chatItem.user.kyc.last_name
                        ? `${chatItem.user.kyc.first_name} ${chatItem.user.kyc.last_name}`
                        : 'Username'}
                    </span>
                    <span>{chatItem.chat}</span>
                  </div>
                </div>
              ))} */}
            </div>
          </div>

          <div onClick={() => setHideChat(x => !x)}>Hide chat</div>
        </div>

        <div className='watchlive__buttonToggle' onClick={() => setHideLive(x => !x)}>
          Watch Live
        </div>

        {!hideLive && (
          <div>
            {liveList.map(live => (
              <div
                key={live._id}
                className='watchlive__livevideo'
                onClick={() => {
                  history.push(`/watchlive?s=${live._id}`)
                  window.scroll(0, 0)
                }}
              >
                <div>
                  <img
                    src={
                      live.thumbnail ? `${STORAGE_DOMAIN}${live.thumbnail.path}` : coverDefaultJPG
                    }
                    alt=''
                  />
                </div>

                <div>
                  <div>{live.name}</div>
                  <div>
                    {live.user.kyc.first_name || live.user.kyc.last_name
                      ? `${live.user.kyc.first_name} ${live.user.kyc.last_name}`
                      : 'Username'}
                  </div>
                  <div>
                    {live.views} views • {convertDateAgo(live.start_date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* <div className='watchlive__buttonToggle' onClick={() => setHideRecommend(x => !x)}>
          Recommend
        </div>

        {!hideRecommend && (
          <div>
            <div className='watchlive__livevideo'>
              <div>
                <img src={bgtest} alt='' />
              </div>

              <div>
                <div>Greatest Hits Game Of Popular</div>
                <div>Trung Quan An Quan</div>
                <div>11 views • 11 minutes ago</div>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  )
}
