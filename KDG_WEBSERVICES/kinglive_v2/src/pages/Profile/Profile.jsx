import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import arrowSVG from '../../assets/svg/arrow.svg'
import coverDefaultJPG from '../../assets/svg/coverDefault.jpg'
import editSVG from '../../assets/svg/edit.svg'
import kdgSVG from '../../assets/svg/kdg.svg'
import menuSVG from '../../assets/svg/menu.svg'
import radioSVG from '../../assets/svg/radio.svg'
import tradeSVG from '../../assets/svg/trade.svg'
import callAPI from '../../axios'
import TableX from '../../components/TableX'
import VideoPlayer from '../../components/VideoPlayer'
import { STORAGE_DOMAIN } from '../../constant'
import convertPositionIMG from '../../helpers/convertPositionIMG'
import isValidDate from '../../helpers/isValidDate'
import { body1, body2, head1, head2 } from '../../mock/table'
import { asyncChangeUser } from '../../store/actions'

const statisticArray = [
  {
    amount: 234,
    name: 'KDG',
  },
  {
    amount: 34,
    name: 'Total Videos Owner',
  },
  {
    amount: 45,
    name: 'Total Views',
  },
  {
    amount: 23,
    name: 'Total Gifts',
  },
  {
    amount: 2434,
    name: 'Followers',
  },
  {
    amount: 324,
    name: 'Followings',
  },
  {
    amount: 45,
    name: 'Total Live (hours)',
  },
]

export default function Profile() {
  const dispatch = useDispatch()

  const [previewIMG, setPreviewIMG] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)

  const userData = useSelector((state) => state.user)
  const avatar = userData?.kyc?.avatar?.path
  const avatarPos = userData?.kyc?.avatar_pos
  const cover = userData?.kyc?.cover?.path
  const coverPos = userData?.kyc?.cover_pos
  const userName = `${userData?.kyc?.first_name} ${userData?.kyc?.last_name}`

  const userBirthday = useMemo(() => {
    let x = userData?.kyc?.birth_day.split('/')
    if (!x) return ''

    let [month, day, year] = x
    return `${day}/${month}/${year}`
  }, [userData])

  const handleEditUser = async (e) => {
    e.preventDefault()

    const data = new FormData(e.target)

    if (!isValidDate(data.get('birth_day'))) return

    const submitData = {}
    for (let field of data) {
      submitData[field[0]] = field[1]
    }

    submitData.gioi_tinh_id = Number(submitData.gioi_tinh_id)
    submitData.id = userData?._id

    let [day, month, year] = submitData.birth_day.split('/')
    submitData.birth_day = `${month}/${day}/${year}`

    try {
      const res = await callAPI.put('/user', submitData)

      if (res.status === 1) {
        dispatch(asyncChangeUser())
      }
    } catch (error) {
      console.log('Error Edit User')
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
            top: 10,
            right: 10,
            display: 'flex',
          }}
        >
          {!isEdit && (
            <div className='profile😢__button-edit' onClick={() => setIsEdit(true)}>
              <img src={editSVG} alt='' />
              <span>Change profile information</span>
            </div>
          )}

          {isEdit && (
            <div className='profile😢__button-edit mr-10'>
              <img src={editSVG} alt='' />
              <span>Change Avatar</span>
            </div>
          )}

          {isEdit && (
            <div className='profile😢__button-edit'>
              <img src={editSVG} alt='' />
              <span>Change Cover</span>
            </div>
          )}
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

      {isEdit && (
        <form onSubmit={handleEditUser} className='profile😢__edit-information'>
          <h3>Edit Information</h3>

          <div className='form-control'>
            <div className='label'>Surname</div>
            <input type='text' name='last_name' defaultValue={userData?.kyc?.last_name || ''} />
          </div>

          <div className='form-control'>
            <div className='label'>First Name</div>
            <input type='text' name='first_name' defaultValue={userData?.kyc?.first_name || ''} />
          </div>

          <div className='form-control'>
            <div className='label'>Phone Number</div>
            <input type='text' name='phone' defaultValue={userData?.kyc?.phone || ''} />
          </div>

          <div className='form-control'>
            <div className='label'>Gender</div>
            <div style={{ display: 'flex' }}>
              <div className='radioContainer mr-30'>
                <input type='radio' name='gioi_tinh_id' value={0} id='male' defaultChecked />
                <div className='pseudo-radio'>
                  <img src={radioSVG} alt='' />
                </div>
                <label htmlFor='male'>Male</label>
              </div>
              <div className='radioContainer'>
                <input type='radio' name='gioi_tinh_id' value={1} id='female' />
                <div className='pseudo-radio'>
                  <img src={radioSVG} alt='' />
                </div>
                <label htmlFor='female'>Female</label>
              </div>
            </div>
          </div>

          <div className='form-control'>
            <div className='label'>Date of birth</div>
            <input
              type='text'
              name='birth_day'
              placeholder='dd/mm/yyyy'
              defaultValue={userBirthday || ''}
            />
          </div>

          <div className='form-control'>
            <div className='label'>Address</div>
            <input type='text' name='address' defaultValue={userData?.kyc?.address || ''} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 35 }}>
            <button type='submit' className='buttonX mr-20'>
              Update
            </button>
            <div className='buttonX buttonX--cancel' onClick={() => setIsEdit(false)}>
              Cancel
            </div>
          </div>
        </form>
      )}

      {!isEdit && (
        <div className='tabsX'>
          <div className='tabsX__header'>
            <div
              className={`item ${tabIndex === 0 ? 'active' : ''}`}
              onClick={() => setTabIndex(0)}
            >
              Personal
            </div>
            <div
              className={`item ${tabIndex === 1 ? 'active' : ''}`}
              onClick={() => setTabIndex(1)}
            >
              Assets
            </div>
            <div
              className={`item ${tabIndex === 2 ? 'active' : ''}`}
              onClick={() => setTabIndex(2)}
            >
              Top Donate
            </div>
          </div>

          <div className='tabsX__body'>
            <div className={`item ${tabIndex === 0 ? 'active' : ''}`}>
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
                    Are you a fan of solving different puzzles, sudoku or crosswords? Here's a fresh
                    set of riddles to entertain and train your brain. Let's see how many you can
                    crack and share your number down. Here's a fresh set of riddles to entertain and
                    train your brain. Let's see how many you can crack and share your number down.
                    Here's a fresh set of riddles to entertain and train your brain. Let's see how
                    many you can crack and share your number down.
                  </div>

                  <img src={menuSVG} alt='' />
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
                      Are you a fan of solving different puzzles, sudoku or crosswords? Here's a
                      fresh set of riddles to entertain and train your brain. Let's see how many you
                      can crack and share your number down. Here's a fresh set of riddles to
                      entertain and train your brain. Let's see how many you can crack and share
                      your number down. Here's a fresh set of riddles to entertain and train your
                      brain. Let's see how many you can crack and share your number down.
                    </div>

                    <img src={menuSVG} alt='' />
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
                          Greatest Hits Game Of Popular Game Of All Time Greatest Hits Game Of
                          Popular Game Of All Time Greatest Hits Game Of Popular Game Of All Time
                        </div>
                        <img src={menuSVG} alt='' />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`item ${tabIndex === 1 ? 'active' : ''}`}>
              <div className='profile😢__box1 mb-15'>
                <div onClick={(e) => e.target.classList.toggle('hide')}>
                  <span>Balance</span>
                  <img src={arrowSVG} alt='' />
                </div>

                <div>
                  <div className='profile😢__coin mb-20'>
                    <img src={kdgSVG} alt='' />
                    <span>2,000</span>
                    <span>KDG</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className='buttonTrade'>
                      <img src={tradeSVG} alt='' />
                      <span>Trade</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='profile😢__box1 mb-15'>
                <div onClick={(e) => e.target.classList.toggle('hide')}>
                  <span>Transaction History</span>
                  <img src={arrowSVG} alt='' />
                </div>

                <div>
                  <div className='mb-20'>
                    <div className='buttonX mr-20'>Swap History</div>
                    <div className='buttonX buttonX--disabled'>Gift History</div>
                  </div>

                  <TableX head={head1} body={body1} />
                </div>
              </div>
            </div>

            <div className={`item ${tabIndex === 2 ? 'active' : ''}`}>
              <div className='profile😢__box1 mb-15'>
                <div onClick={(e) => e.target.classList.toggle('hide')}>
                  <span>Top Donate</span>
                  <img src={arrowSVG} alt='' />
                </div>

                <div>
                  <TableX head={head2} body={body2} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}