import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import '../../assets/scss/watchlive.scss'
import avatarDefaultSVG from '../../assets/svg/avatarDefault.svg'
import thumb from '../../assets/svg/thumb.png'
// import shareSVG from '../../assets/svg/share.svg'
import callAPI from '../../axios'
import ButtonFollow from '../../components/ButtonFollow'
import VideoPlayer from '../../components/VideoPlayer'
import { STORAGE_DOMAIN } from '../../constant'
import convertDateAgo from '../../helpers/convertDateAgo'
import emptyGift from '../../assets/svg/emptyGift.svg'

export default function WatchVideo() {
  const history = useHistory()
  const userRedux = useSelector((state) => state.user)

  const [videoData, setVideoData] = useState({})
  const user = useMemo(() => videoData.user, [videoData])

  const [liveList, setLiveList] = useState([])
  const [isFollow, setIsFollow] = useState(false)
  const [hideLive, setHideLive] = useState(false)

  const id = new URLSearchParams(window.location.search).get('v')
  if (!id) history.push('/')

  useEffect(() => {
    ;(async () => {
      try {
        const res = await callAPI.get(`/video?sid=${id}`)
        setVideoData(res.data)

        // Check Follow Yet
        if (res.is_followed) {
          setIsFollow(true)
        } else {
          setIsFollow(false)
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [id, history])

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

  const handleFollow = async () => {
    try {
      const res = await callAPI.post(`follow?id=${user?._id}`)
      if (res.status === 1) setIsFollow((x) => !x)
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
            {videoData.views} views • {convertDateAgo(videoData.create_date)}
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
        <div className='watchlive__buttonToggle' onClick={() => setHideLive((x) => !x)}>
          Watch Live
        </div>

        {!hideLive && (
          <>
            {liveList.length !== 0 && (
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
                        src={live.thumbnail ? `${STORAGE_DOMAIN}${live.thumbnail.path}` : thumb}
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

            {liveList.length === 0 && (
              <div
                style={{
                  height: 362,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img src={emptyGift} alt='' />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
