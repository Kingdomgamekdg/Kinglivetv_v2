import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import '../../assets/scss/profile.scss'
import coverDefaultJPG from '../../assets/svg/coverDefault.jpg'
import callAPI from '../../axios'
import ButtonFollow from '../../components/ButtonFollow'
import VideoPlayer from '../../components/VideoPlayer'
import { STORAGE_DOMAIN } from '../../constant'
import convertPositionIMG from '../../helpers/convertPositionIMG'

const statisticArray = [
  {
    amount: 45,
    name: 'Total Views',
  },
  {
    amount: 2434,
    name: 'Followers',
  },
  {
    amount: 324,
    name: 'Followings',
  },
]

export default function User() {
  const history = useHistory()

  const userRedux = useSelector((state) => state.user)
  const [isFollow, setIsFollow] = useState(false)
  const [previewIMG, setPreviewIMG] = useState('')

  const [userData, setUserData] = useState({})
  const avatar = useMemo(() => userData?.kyc?.avatar?.path, [userData])
  const avatarPos = useMemo(() => userData?.kyc?.avatar_pos, [userData])
  const cover = useMemo(() => userData?.kyc?.cover?.path, [userData])
  const coverPos = useMemo(() => userData?.kyc?.cover_pos, [userData])
  const userName = useMemo(
    () => `${userData?.kyc?.first_name} ${userData?.kyc?.last_name}`,
    [userData]
  )

  const uid = new URLSearchParams(window.location.search).get('uid')
  if (!uid) {
    history.push('/')
  }

  // Get Profile of user dependent uid
  useEffect(() => {
    // if (uid === userRedux?._id) {
    //   return history.push('/profile')
    // }

    ;(async () => {
      try {
        const res = await callAPI.get(`/user?uid=${uid}`)
        console.log({ userData: res.data })
        setUserData(res.data)

        // Check Follow Yet
        if (res.data.isFollowed) {
          setIsFollow(true)
        } else {
          setIsFollow(false)
        }
      } catch (error) {
        console.log('Error get user', error)
      }
    })()
  }, [uid, userRedux, history])

  // Follow and Unfollow
  const handleFollow = async () => {
    try {
      const res = await callAPI.post(`follow?id=${userData?._id}`)
      if (res.status === 1) setIsFollow((x) => !x)
    } catch (error) {
      console.log('error follow or unfollow', error)
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
            src={`${STORAGE_DOMAIN}${cover}`}
            alt=''
            style={convertPositionIMG(coverPos)}
            onClick={() => setPreviewIMG(`${STORAGE_DOMAIN}${cover}`)}
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
              src={`${STORAGE_DOMAIN}${avatar}`}
              alt=''
              style={convertPositionIMG(avatarPos)}
              onClick={() => setPreviewIMG(`${STORAGE_DOMAIN}${avatar}`)}
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

        <div className='flexbox flex3' style={{ '--gap-col': '5px', '--gap-row': '25px' }}>
          {[1, 2, 3].map((item) => (
            <div key={item} className='flexbox__item profile😢__video'>
              <div className='thumbnail'>
                <img src={coverDefaultJPG} alt='' />
              </div>

              <div className='info'>
                <div>
                  Greatest Hits Game Of Popular Game Of All Time Greatest Hits Game Of Popular Game
                  Of All Time Greatest Hits Game Of Popular Game Of All Time
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
