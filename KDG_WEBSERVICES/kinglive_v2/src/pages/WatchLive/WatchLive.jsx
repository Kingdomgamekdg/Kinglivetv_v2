import { useEffect, useMemo, useRef, useState } from 'react'
import ReactHlsPlayer from 'react-hls-player'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import '../../assets/scss/watchlive.scss'
import avatarDefaultSVG from '../../assets/svg/avatarDefault.svg'
import coverDefaultJPG from '../../assets/svg/coverDefault.jpg'
import giftPNG from '../../assets/svg/gift.png'
import sendSVG from '../../assets/svg/send.svg'
import shareSVG from '../../assets/svg/share.svg'
import callAPI from '../../axios'
import ButtonFollow from '../../components/ButtonFollow'
import { PLAY_STREAM, STORAGE_DOMAIN } from '../../constant'
import convertDateAgo from '../../helpers/convertDateAgo'
import socket from '../../socket'

export default function WatchLive() {
  const history = useHistory()
  const userRedux = useSelector((state) => state.user)

  const chatListRef = useRef()

  const [streamData, setStreamData] = useState({})
  const user = useMemo(() => streamData.user, [streamData])
  const streamKey = useMemo(() => streamData.key, [streamData])

  const [streamData1, setStreamData1] = useState({})

  const [chatData, setChatData] = useState([])
  const [liveList, setLiveList] = useState([])
  const [isFollow, setIsFollow] = useState(false)

  const [hideChat, setHideChat] = useState(false)
  const [hideLive, setHideLive] = useState(false)

  const id = new URLSearchParams(window.location.search).get('s')
  if (!id) history.push('/')

  useEffect(() => {
    const handleStream = (data) => setStreamData1(data)
    socket.on('stream', handleStream)
    return () => socket.removeEventListener('stream', handleStream)
  }, [])

  useEffect(() => console.log({ streamData1 }), [streamData1])

  // Get Current LiveVideo
  useEffect(() => {
    let streamId
    ;(async () => {
      try {
        const res = await callAPI.get(`/streamming?id=${id}`)
        console.log({ streamData: res })
        setStreamData(res.data)

        // Check Follow Yet
        if (res.is_followed) {
          setIsFollow(true)
        } else {
          setIsFollow(false)
        }

        streamId = res.data._id
        socket.emit('join_stream', streamId)
      } catch (error) {
        console.log('error get video livestream')
        console.log(error)
      }
    })()

    return () => {
      socket.emit('leave_stream', streamId)
    }
  }, [id, history])

  // Get Chat of LiveVideo
  useEffect(() => {
    ;(async () => {
      try {
        const res = await callAPI.get(`/chats?stream=${id}`)
        console.log({ chatData: res })
        setChatData(res.data)
      } catch (error) {
        console.log('error get chat')
        console.log(error)
      }
    })()

    const handleReceiveChat = (chatItem) => setChatData((_chatData) => [..._chatData, chatItem])
    socket.on('chat', handleReceiveChat)

    return () => {
      socket.removeEventListener('chat', handleReceiveChat)
    }
  }, [id])

  // Scroll ChatBox to very bottom when have new chat
  useEffect(() => {
    chatListRef.current.scroll(0, chatListRef.current.scrollHeight)
  }, [chatData])

  // Emit new Chat
  const handleChat = (e) => {
    e.preventDefault()

    const data = new FormData(e.target)
    const chat = data.get('chat')
    if (!chat) return

    console.log({ chat })
    socket.emit('chat', { room: streamData._id, chat })
    e.target.reset()
  }

  // Get Live List
  useEffect(() => {
    ;(async () => {
      try {
        const res = await callAPI.get('/streammings')
        console.log({ liveList: res })
        setLiveList(res.data)
      } catch (error) {
        console.log('error get live list')
        console.log(error)
      }
    })()
  }, [])

  // Follow and Unfollow
  const handleFollow = async () => {
    try {
      const res = await callAPI.post(`follow?id=${user?._id}`)
      if (res.status === 1) setIsFollow((x) => !x)
    } catch (error) {
      console.log('error follow or unfollow', error)
    }
  }

  const [showGift, setShowGift] = useState(false)
  const [NFTList, setNFTList] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await callAPI.get(`/user-asset?limit=20&status=1&`)

        if (res.status === 1) {
          console.log({ NFTList: res.data })
          setNFTList(res.data)
        }
      } catch (error) {
        console.log('error get my nft')
        console.log(error)
      }
    })()
  }, [])

  const handleDonate = async (e) => {
    e.preventDefault()
    setShowGift(false)

    const formData = new FormData(e.target)
    const data = {}
    for (const x of formData) {
      const [key, value] = x
      data[key] = value
    }
    data.amount = Number(data.amount) || 1

    const _from = window.ethereum.selectedAddress
    const _to = user?.address
    const _id = data.id
    const _amount = data.amount
    const _data = 0x00

    try {
      await window.contractKL1155.methods
        .safeTransferFrom(_from, _to, _id, _amount, _data)
        .send({ from: _from })

      const res = await callAPI.get(`/user-asset?limit=20&status=1&`)

      if (res.status === 1) {
        console.log({ NFTList: res.data })
        setNFTList(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className={`popupGift ${showGift ? 'show' : ''}`}>
        <div className='popupGift__mask' onClick={() => setShowGift(false)}></div>

        <div className='popupGift__content'>
          <div style={{ color: '#fefefe', marginBottom: 16 }}>Gift</div>
          <div className='flexbox flex4'>
            {NFTList.map((nft) => (
              <form onSubmit={handleDonate} key={nft._id} className='popupGift__gift flexbox__item'>
                <img src={nft.asset.metadata.image_thumbnail} alt='gift' />
                <p>{nft.asset.metadata.name}</p>
                <p>{nft.amount}</p>
                <input
                  type='number'
                  name='amount'
                  defaultValue={1}
                  onInput={(e) => {
                    if (Number(e.target.value) <= 0) e.target.value = ''
                    if (Number(e.target.value) >= nft.amount) e.target.value = 100
                  }}
                />
                <input
                  style={{ display: 'none' }}
                  type='text'
                  name='id'
                  readOnly
                  defaultValue={nft.asset.id}
                />
                <button style={{ display: 'none' }} type='submit'>
                  Donate
                </button>
              </form>
            ))}
          </div>
        </div>
      </div>

      <div className='watchlive'>
        <div className='watchlive__left'>
          <div className='watchlive__videoContainer'>
            <ReactHlsPlayer
              className='watchlive__videoPlayer'
              src={`${PLAY_STREAM}${streamKey}/index.m3u8`}
              autoPlay={true}
              controls={true}
              muted={false}
              width='100%'
              height='100%'
            />
          </div>

          <div className='watchlive__titleVideo'>{streamData.name}</div>

          <div className='mb-30'>
            <span>
              {streamData.views} views • {convertDateAgo(streamData.start_date)}
            </span>
            {/* <span className='button-share'>
              <img src={shareSVG} alt='' />
              Share
            </span> */}
          </div>

          <div className='watchlive__infoVideo'>
            <div onClick={() => history.push(`/user?uid=${user?._id}`)}>
              <img
                src={
                  user?.kyc?.avatar?.path
                    ? `${STORAGE_DOMAIN}${user.kyc.avatar.path}`
                    : avatarDefaultSVG
                }
                alt=''
              />
            </div>

            <div style={{ position: 'relative' }}>
              <div onClick={() => history.push(`/user?uid=${user?._id}`)}>
                {user?.kyc?.first_name || user?.kyc?.last_name
                  ? `${user?.kyc?.first_name} ${user?.kyc?.last_name}`
                  : 'Username'}
              </div>
              <div>{user?.kinglive.total_follower} followers</div>
              <div>{streamData.description}</div>

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
                {chatData.map((chatItem) => (
                  <div key={chatItem._id} className='watchlive__chatItem'>
                    <div>
                      <img
                        src={
                          chatItem.user?.kyc?.avatar?.path
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
                ))}
              </div>

              <form className='watchlive__chatInput' onSubmit={handleChat}>
                <div>
                  <img
                    src={
                      user?.kyc?.avatar?.path
                        ? `${STORAGE_DOMAIN}${user.kyc.avatar.path}`
                        : avatarDefaultSVG
                    }
                    alt=''
                  />
                </div>

                <div>
                  <input type='text' name='chat' />
                  <button type='submit'>
                    <img src={sendSVG} alt='' />
                  </button>
                  {userRedux && user && userRedux.address !== user.address && (
                    <img src={giftPNG} alt='' onClick={() => setShowGift(true)} />
                  )}
                </div>
              </form>
            </div>

            <div onClick={() => setHideChat((x) => !x)}>Hide chat</div>
          </div>

          <div className='watchlive__buttonToggle' onClick={() => setHideLive((x) => !x)}>
            Watch Live
          </div>

          {!hideLive && (
            <div>
              {liveList.map((live) => (
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
        </div>
      </div>
    </>
  )
}
