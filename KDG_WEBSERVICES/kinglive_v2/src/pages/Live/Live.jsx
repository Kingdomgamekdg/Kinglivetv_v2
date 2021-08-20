import '../../assets/scss/live.scss'
// import banner from '../../assets/images/live/banner.png'
import banner01 from '../../assets/images/home/b01.jpg'
import banner02 from '../../assets/images/home/b02.jpg'
import banner03 from '../../assets/images/home/b03.jpg'
import { useCallback, useEffect, useRef, useState } from 'react'
import callAPI from '../../axios'
import emptyGift from '../../assets/svg/emptyGift.svg'
import coverDefault from '../../assets/svg/coverDefault.jpg'
import avatarDefault from '../../assets/svg/avatarDefault.svg'
import { STORAGE_DOMAIN } from '../../constant'
import convertDateAgo from '../../helpers/convertDateAgo'
import { useHistory } from 'react-router-dom'

// const slide = [banner, banner, banner]
const slide = [banner01, banner02, banner03]

const live = []
for (let index = 0; index < 100; index++) {
  live.push(index)
}
export default function Live() {
  const history = useHistory()

  const [ActiveSlide, setActiveSlide] = useState(0)
  const [ActiveTab, setActiveTab] = useState(0)
  const timeout = useRef(null)
  useEffect(() => {
    timeout.current = setTimeout(() => {
      if (ActiveSlide < slide.length - 1) {
        setActiveSlide(ActiveSlide + 1)
      } else {
        setActiveSlide(0)
      }
    }, 5000)
  }, [ActiveSlide])

  const manualChangeSlide = useCallback((index) => {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }
    setActiveSlide(index)
  }, [])

  const [streamList, setStreamList] = useState([])

  useEffect(() => {
    callAPI
      .get('/streammings')
      .then((res) => {
        if (res.status === 1) {
          console.log({ streamList: res.data })
          setStreamList(res.data)
        }
      })
      .catch((error) => {
        console.log('error get streamList')
        console.log(error)
      })
  }, [])

  return (
    <>
      <div className='live'>
        <div className='slide-track'>
          <div
            style={{ '--translate': -(100 / slide.length) * ActiveSlide + '%' }}
            className='slide'
          >
            {slide.map((o) => (
              <div className='item'>
                <img src={o} alt='' />
              </div>
            ))}
          </div>
          <div className='controls'>
            {slide.map((o, index) => (
              <div
                onClick={() => manualChangeSlide(index)}
                className={`btn ${ActiveSlide === index ? 'active' : ''}`}
              ></div>
            ))}
          </div>
        </div>
        <div className='container live-container'>
          <div className='left'>
            {/* <div className='title-controls'>
              <h2 className='title'>Watch Live</h2>
              <div className='controls'>
                <div onClick={handleMinusSlideLive} className='btn left'></div>
                <div onClick={handlePlusSlideLive} className='btn right'></div>
              </div>
            </div> */}
            {/* <div className='watch-live-track'>
              <div
                style={{
                  '--total-item': 100,
                  '--translate': -(33.33333 / live.length) * ActiveLive + '%',
                }}
                className='watch-live'
              >
                {live.map((o) => (
                  <div className='item'>
                    <div className='video-live'>
                      <div className='watching'>
                        <svg
                          width='4'
                          height='4'
                          viewBox='0 0 4 4'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <circle cx='1.87987' cy='1.6621' r='1.6621' fill='#F52871' />
                        </svg>
                        Live
                        <svg
                          width='11'
                          height='6'
                          viewBox='0 0 11 6'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M10.3372 2.53231C10.2715 2.40263 7.97821 0 5.22605 0C2.47389 0 0.180041 2.40263 0.0491741 2.53231C0.0168887 2.59225 0 2.65915 0 2.7271C0 2.79505 0.0168887 2.86195 0.0491741 2.92189C0.180041 3.05157 2.40817 5.4542 5.22605 5.4542C8.04392 5.4542 10.2721 3.05157 10.3372 2.92189C10.3677 2.89919 10.3924 2.86978 10.4095 2.83597C10.4265 2.80216 10.4354 2.76489 10.4354 2.7271C10.4354 2.68931 10.4265 2.65203 10.4095 2.61823C10.3924 2.58442 10.3677 2.555 10.3372 2.53231ZM5.22605 4.86982C4.6541 4.86484 4.10699 4.63749 3.70255 4.23672C3.2981 3.83596 3.06866 3.29384 3.06363 2.7271C3.06363 2.15881 3.29146 1.6138 3.69699 1.21197C4.10252 0.810128 4.65254 0.584378 5.22605 0.584378C5.79955 0.584378 6.34957 0.810128 6.7551 1.21197C7.16063 1.6138 7.38846 2.15881 7.38846 2.7271C7.37234 3.29033 7.13934 3.82611 6.73725 4.22454C6.33516 4.62296 5.79446 4.85384 5.22605 4.86982Z'
                            fill='#F52871'
                          />
                          <path
                            d='M5.5067 2.12C5.49547 1.97604 5.52664 1.83195 5.59643 1.70521C5.66622 1.57846 5.77163 1.4745 5.89986 1.40595C5.68341 1.27358 5.43299 1.20594 5.17868 1.21115C4.9799 1.20797 4.7825 1.24441 4.59821 1.31833C4.41393 1.39224 4.24652 1.50211 4.10594 1.64141C3.96537 1.78071 3.85449 1.94659 3.77989 2.1292C3.7053 2.3118 3.66852 2.50741 3.67173 2.70438C3.66852 2.90135 3.7053 3.09695 3.77989 3.27956C3.85449 3.46216 3.96537 3.62805 4.10594 3.76734C4.24652 3.90664 4.41393 4.01651 4.59821 4.09043C4.7825 4.16434 4.9799 4.20079 5.17868 4.1976C5.5352 4.196 5.88015 4.0721 6.15488 3.84694C6.42961 3.62179 6.61716 3.3093 6.68563 2.9626C6.57452 3.00821 6.45463 3.02899 6.33449 3.02345C6.21436 3.01791 6.09693 2.98619 5.99058 2.93055C5.88423 2.87491 5.79156 2.79672 5.71919 2.70154C5.64681 2.60637 5.5965 2.49655 5.57185 2.37991C5.52009 2.3035 5.49703 2.21152 5.5067 2.12Z'
                            fill='#F52871'
                          />
                        </svg>
                        10k
                      </div>
                      <div className='thumb'>
                        <img src={banner} alt='' />
                      </div>
                      <div className='detail-avatar'>
                        <div className='avatar'>
                          <img src={banner} alt='' />
                        </div>
                        <div className='detail'>
                          <div className='name'>Đây là cái tiêu đề</div>
                          <div className='view-time'>
                            11view
                            <svg
                              width='4'
                              height='4'
                              viewBox='0 0 4 4'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <circle cx='1.67185' cy='2.23797' r='1.40135' fill='#98999A' />
                            </svg>
                            11 days ago
                          </div>
                          <div className='user-name'>Vai cai lon</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
            <div className='title-controls'>
              <h2 className='title'>Watch Live</h2>
            </div>

            {streamList.length === 0 && (
              <div
                style={{
                  height: 472,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img src={emptyGift} alt='' />
              </div>
            )}

            {streamList.length !== 0 && (
              <div className='recommend'>
                {streamList.map((stream) => (
                  <div className='item' onClick={() => history.push(`/watchlive?s=${stream._id}`)}>
                    <div className='video-live'>
                      <div className='thumb'>
                        <img
                          src={
                            stream.thumbnail?.path
                              ? `${STORAGE_DOMAIN}${stream.thumbnail.path}`
                              : coverDefault
                          }
                          alt=''
                        />
                      </div>
                      <div className='detail-avatar'>
                        <div className='avatar'>
                          <img
                            src={
                              stream.user?.kyc?.avatar?.path
                                ? `${STORAGE_DOMAIN}${stream.user.kyc.avatar.path}`
                                : avatarDefault
                            }
                            alt=''
                          />
                        </div>
                        <div className='detail'>
                          <div className='name'>{stream.name}</div>
                          <div className='view-time'>
                            {stream.views} views
                            <svg
                              width='4'
                              height='4'
                              viewBox='0 0 4 4'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <circle cx='1.67185' cy='2.23797' r='1.40135' fill='#98999A' />
                            </svg>
                            {convertDateAgo(stream.start_date)}
                          </div>
                          <div className='user-name'>
                            {stream.user?.kyc?.first_name
                              ? `${stream.user?.kyc?.first_name} ${stream.user?.kyc?.last_name}`
                              : 'Username'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='right'>
            <div style={{ '--item': ActiveTab }} className='ranking'>
              <div className='title'>Ranking</div>
              <div className='tabs'>
                <div
                  onClick={() => setActiveTab(0)}
                  className={`tab ${ActiveTab === 0 ? 'active' : ''}`}
                >
                  Followers
                </div>
                <div
                  onClick={() => setActiveTab(1)}
                  className={`tab ${ActiveTab === 1 ? 'active' : ''}`}
                >
                  Views
                </div>
              </div>
              <div className='track-tabs'>
                <div className='tabs-items'>
                  <div className='tab-item'>
                    <div className='item'>
                      <div className='avatar'>
                        <img src={avatarDefault} alt='' />
                      </div>
                      <div className='info'>
                        <div className='name'>Tên nà</div>
                        <div className='rank-info'>63 Followers</div>
                      </div>
                    </div>
                  </div>
                  <div className='tab-item'>
                    <div className='item'>
                      <div className='avatar'>
                        <img src={avatarDefault} alt='' />
                      </div>
                      <div className='info'>
                        <div className='name'>Tên nà</div>
                        <div className='rank-info'>63 Followers</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
