import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import '../../assets/scss/profile.scss'
import avatarDefault from '../../assets/svg/avatarDefault.svg'
import coverDefault from '../../assets/svg/coverDefault.jpg'
import emptyGift from '../../assets/svg/emptyGift.svg'
import thumb from '../../assets/svg/thumb.png'
import callAPI from '../../axios'
import ButtonFollow from '../../components/ButtonFollow'
import VideoPlayer from '../../components/VideoPlayer'
import { STORAGE_DOMAIN } from '../../constant'
import convertPositionIMG from '../../helpers/convertPositionIMG'
import { statisticArray } from '../../mock/user'

export default function User() {
  const history = useHistory()

  const [isFollow, setIsFollow] = useState(false)
  const [previewIMG, setPreviewIMG] = useState('')

  const [userData, setUserData] = useState({})
  const avatar = userData?.kyc?.avatar?.path
  const avatarPos = userData?.kyc?.avatar_pos
  const cover = userData?.kyc?.cover?.path
  const coverPos = userData?.kyc?.cover_pos
  const userName = `${userData?.kyc?.first_name} ${userData?.kyc?.last_name}`

  const uid = new URLSearchParams(window.location.search).get('uid')
  if (!uid) history.push('/')

  useEffect(() => {
    callAPI
      .get(`/user?uid=${uid}`)
      .then((res) => {
        if (res.status === 1) {
          setUserData(res.data)
          setIsFollow(!!res.data.isFollowed)
        }
      })
      .catch((error) => console.log(error))
  }, [uid, history])

  const handleFollow = async () => {
    try {
      const res = await callAPI.post(`follow?id=${userData?._id}`)
      res.status === 1 && setIsFollow((x) => !x)
    } catch (error) {
      console.log(error)
    }
  }

  const [uploadList, setUploadList] = useState([])
  const [seeMoreCount, setSeeMoreCount] = useState(0)

  useEffect(() => {
    callAPI
      .get(`/videos?user=${uid}&limit=6`)
      .then((res) => {
        if (res.status === 1) {
          setUploadList(res.data)
          const count = Math.ceil((res.total - 6) / 12)
          if (count <= 0) return
          setSeeMoreCount(count)
        }
      })
      .catch((error) => console.log(error))
  }, [uid])

  const handleSeeMore = async () => {
    if (uploadList.length === 0) return

    try {
      const lastVideoId = uploadList[uploadList.length - 1]._id
      const res = await callAPI.get(`/videos?user=${uid}&limit=12&last=${lastVideoId}`)
      console.log(res)
      setUploadList((list) => [...list, ...res.data])
      setSeeMoreCount((x) => x - 1)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='profile😢 container'>
      <div style={{ position: 'relative', marginBottom: 60 }}>
        {previewIMG && (
          <div className='profile😢__previewIMG' onClick={() => setPreviewIMG('')}>
            <img src={previewIMG} alt='' />
          </div>
        )}

        <div className='profile😢__cover'>
          <img
            alt=''
            style={convertPositionIMG(coverPos)}
            onClick={(e) => setPreviewIMG(e.target.src)}
            src={cover ? `${STORAGE_DOMAIN}${cover}` : coverDefault}
          />
          <span></span>
        </div>

        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className='profile😢__avatar'>
            <img
              alt=''
              style={convertPositionIMG(avatarPos)}
              onClick={(e) => setPreviewIMG(e.target.src)}
              src={avatar ? `${STORAGE_DOMAIN}${avatar}` : avatarDefault}
            />
            <span></span>
          </div>
        </div>
      </div>

      <div className='profile😢__name'>{!userName || userName === ' ' ? 'Username' : userName}</div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10, marginBottom: 25 }}>
        <ButtonFollow isFollow={isFollow} handleFollow={handleFollow} />
      </div>

      <div className='profile😢__statistic'>
        {statisticArray.map((item) => (
          <div key={item.name} className='itemStatistic'>
            <div className='absolute'>
              <span>{item.amount}</span>
              <span>{item.name}</span>
            </div>
          </div>
        ))}
      </div>

      <div className='profile😢__introduce'>
        <VideoPlayer guid={`7ba74ab1-fc07-4a55-8394-2a1b1f771049`} />

        <div>
          <div>Epic Riddles Marathon Only Bravest Detectives Can Pass</div>
          <div>39 views • 8 days ago</div>
          <div>
            Are you a fan of solving different puzzles, sudoku or crosswords? Here's a fresh set of
            riddles to entertain and train your brain. Let's see how many you can crack and share
            your number down. Here's a fresh set of riddles to entertain and train your brain. Let's
            see how many you can crack and share your number down. Here's a fresh set of riddles to
            entertain and train your brain. Let's see how many you can crack and share your number
            down.
          </div>
        </div>
      </div>

      <div>
        <div className='profile😢__title'>Live</div>

        <div className='profile😢__introduce'>
          <VideoPlayer guid={`7ba74ab1-fc07-4a55-8394-2a1b1f771049`} />

          <div>
            <div>Epic Riddles Marathon Only Bravest Detectives Can Pass</div>
            <div>39 views • 8 days ago</div>
            <div>
              Are you a fan of solving different puzzles, sudoku or crosswords? Here's a fresh set
              of riddles to entertain and train your brain. Let's see how many you can crack and
              share your number down. Here's a fresh set of riddles to entertain and train your
              brain. Let's see how many you can crack and share your number down. Here's a fresh set
              of riddles to entertain and train your brain. Let's see how many you can crack and
              share your number down.
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className='profile😢__title'>Video Uploaded</div>

        {uploadList.length !== 0 && (
          <>
            <div className='flexbox flex3' style={{ '--gap-col': '5px' }}>
              {uploadList.map((video) => (
                <div
                  key={video._id}
                  className='flexbox__item profile😢__video'
                  onClick={() => history.push(`/watchvideo?v=${video.short_id}`)}
                >
                  <div className='thumbnail'>
                    <img
                      // src={`https://vz-3f44931c-ed0.b-cdn.net/${video.guid}/thumbnail.jpg`}
                      src={thumb}
                      alt=''
                    />
                  </div>

                  <div className='info'>
                    <div>{video.name}</div>
                  </div>
                </div>
              ))}
            </div>

            {seeMoreCount !== 0 && (
              <div className='buttonSeeMore pb-65' onClick={handleSeeMore}>
                See more
              </div>
            )}
          </>
        )}

        {uploadList.length === 0 && (
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
      </div>
    </div>
  )
}
