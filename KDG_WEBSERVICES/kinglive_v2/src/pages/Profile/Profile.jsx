import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import arrowSVG from '../../assets/svg/arrow.svg'
import avatarDefault from '../../assets/svg/avatarDefault.svg'
import checkSVG from '../../assets/svg/check.svg'
import closeSVG from '../../assets/svg/close.svg'
import coverDefault from '../../assets/svg/coverDefault.jpg'
import thumb from '../../assets/svg/thumb.png'
import editSVG from '../../assets/svg/edit.svg'
import emptyGift from '../../assets/svg/emptyGift.svg'
import errorSVG from '../../assets/svg/error.svg'
import kdgSVG from '../../assets/svg/kdg.svg'
import menuSVG from '../../assets/svg/menu.svg'
import radioSVG from '../../assets/svg/radio.svg'
import tradeSVG from '../../assets/svg/trade.svg'
import callAPI from '../../axios'
import DemoCrop from '../../components/DemoCrop/DemoCrop'
import TableX from '../../components/TableX'
import VideoPlayer from '../../components/VideoPlayer'
import { STORAGE_DOMAIN } from '../../constant'
import convertPositionIMG from '../../helpers/convertPositionIMG'
import isValidDate from '../../helpers/isValidDate'
import { statisticArray } from '../../mock/profile'
import { body1, body2, head1, head2 } from '../../mock/table'
import { asyncChangeUser } from '../../store/actions'

export default function Profile() {
  const dispatch = useDispatch()
  const history = useHistory()

  const [isEdit, setIsEdit] = useState(false)
  const [editSuccess, setEditSuccess] = useState(false)
  const [editError, setEditError] = useState(false)
  const [showCrop, setShowCrop] = useState(false)
  const [showPickImage, setShowPickImage] = useState(false)

  const [image, setImage] = useState('')
  const [imageId, setImageId] = useState('')
  const [previewIMG, setPreviewIMG] = useState('')
  const [tabIndex, setTabIndex] = useState(0)
  const [typeImage, setTypeImage] = useState(1)
  const [imageList, setImageList] = useState([])

  const userData = useSelector((state) => state.user)
  const userId = userData?._id
  const avatar = userData?.kyc?.avatar?.path
  const avatarPos = userData?.kyc?.avatar_pos
  const cover = userData?.kyc?.cover?.path
  const coverPos = userData?.kyc?.cover_pos
  const lastName = userData?.kyc?.last_name
  const firstName = userData?.kyc?.first_name
  const phone = userData?.kyc?.phone
  const address = userData?.kyc?.address
  const userName = `${userData?.kyc?.first_name} ${userData?.kyc?.last_name}`

  const birthday = useMemo(() => {
    if (!userData?.kyc?.birth_day) return ''
    const [month, day, year] = userData?.kyc?.birth_day.split('/')
    return `${day}/${month}/${year}`
  }, [userData])

  const handleEditUser = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    if (!isValidDate(formData.get('birth_day'))) {
      setEditError(true)
      return
    }

    const submitData = {}
    for (let field of formData) {
      submitData[field[0]] = field[1]
    }

    submitData.gioi_tinh_id = Number(submitData.gioi_tinh_id)
    submitData.id = userData?._id

    const [day, month, year] = submitData.birth_day.split('/')
    submitData.birth_day = `${month}/${day}/${year}`

    try {
      const res = await callAPI.put('/user', submitData)

      if (res.status === 1) {
        dispatch(asyncChangeUser())
        setEditSuccess(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    callAPI
      .get('/avatar')
      .then((res) => res.status === 1 && setImageList(res.data))
      .catch((error) => console.log(error))
  }, [])

  const handleUploadImage = (_typeImg) => {
    if (_typeImg === 'avatar') setTypeImage(1)
    if (_typeImg === 'cover') setTypeImage(2)
    setShowPickImage(true)
  }

  const handleInputImage = (e) => {
    const files = [...e.target.files]
    if (files.length === 0) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target.result)
      setShowCrop(true)
      setShowPickImage(false)
    }
    reader.readAsDataURL(files[0])
  }

  const handleCancelCrop = () => {
    setShowCrop(false)
    setImage('')
    setImageId('')
    document.getElementById('upload').value = ''
  }

  const handleFinishCrop = async (imagePos) => {
    try {
      await callAPI.post(`/avatar_pos?type=${typeImage}`, imagePos)
    } catch (error) {
      console.log(error)
    }

    if (imageId) {
      try {
        await callAPI.post(`/avatar?avatar=${imageId}&type=${typeImage}`)
      } catch (error) {
        console.log(error)
      }
    } else {
      const formData = new FormData()
      formData.append('file', document.getElementById('upload').files[0])

      try {
        await callAPI.post(`/avatar?type=${typeImage}`, formData)
      } catch (error) {
        console.log(error)
      }
    }

    dispatch(asyncChangeUser())
    handleCancelCrop()
  }

  const [uploadList, setUploadList] = useState([])
  const [seeMoreCount, setSeeMoreCount] = useState(0)

  useEffect(() => {
    callAPI
      .get(`/videos?user=${userId}&limit=6`)
      .then((res) => {
        if (res.status === 1) {
          setUploadList(res.data)
          const count = Math.ceil((res.total - 6) / 12)
          if (count <= 0) return
          setSeeMoreCount(count)
        }
      })
      .catch((error) => console.log(error))
  }, [userId])

  const handleSeeMore = async () => {
    if (uploadList.length === 0) return

    try {
      const lastVideoId = uploadList[uploadList.length - 1]._id
      const res = await callAPI.get(`/videos?user=${userId}&limit=12&last=${lastVideoId}`)
      console.log(res)
      setUploadList((list) => [...list, ...res.data])
      setSeeMoreCount((x) => x - 1)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {showCrop && (
        <div className={`popupX ${typeImage === 1 ? 'avatarX' : ''}`}>
          <DemoCrop
            image={image}
            typeImage={typeImage}
            onCancel={handleCancelCrop}
            onFinish={handleFinishCrop}
          />
        </div>
      )}

      <div className={`popupGift ${showPickImage ? 'show' : ''}`}>
        <div className='popupGift__mask' onClick={() => setShowPickImage(false)}></div>

        <div className='popupGift__content'>
          <div style={{ color: '#fefefe', fontSize: 20, textAlign: 'center' }}>Choose Image</div>

          <div
            className='buttonX mt-30 d-block'
            onClick={() => document.getElementById('upload').click()}
          >
            Upload from your PC
          </div>

          <input
            onInput={handleInputImage}
            type='file'
            id='upload'
            accept='.png,.jpg,.jpeg'
            style={{ display: 'none' }}
          />

          <div
            className='mt-10 mb-10'
            style={{ color: '#fefefe', fontSize: 16, textAlign: 'center' }}
          >
            or select previously uploaded photo
          </div>

          {imageList.length !== 0 && (
            <div className='flexbox flex4' style={{ maxHeight: 600, overflowY: 'auto' }}>
              {imageList.map((o) => (
                <img
                  alt=''
                  key={o._id}
                  className='flexbox__item'
                  src={`${STORAGE_DOMAIN}${o.path}`}
                  style={{ objectFit: 'contain', cursor: 'pointer', height: 130 }}
                  onClick={(e) => {
                    setShowCrop(true)
                    setShowPickImage(false)
                    setImage(e.target.src)
                    setImageId(o._id)
                  }}
                />
              ))}
            </div>
          )}

          {imageList.length === 0 && (
            <div
              style={{
                height: 362,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img src={emptyGift} alt='' />
            </div>
          )}
        </div>
      </div>

      {editError && (
        <div className='popupX'>
          <div className='containerX'>
            <img className='closeX' src={closeSVG} alt='' onClick={() => setEditError(false)} />
            <div className='titleX'>Wrong birthday format!</div>
            <div className='descriptionX'>
              <img src={errorSVG} alt='' />
              <span>Please enter correct birthday format 'dd/mm/yyyy'</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className='buttonX okX' onClick={() => setEditError(false)}>
                Ok
              </div>
            </div>
          </div>
        </div>
      )}

      {editSuccess && (
        <div className='popupX'>
          <div className='containerX'>
            <img className='closeX' src={closeSVG} alt='' onClick={() => setEditSuccess(false)} />
            <div className='titleX'>Your information was edited!</div>
            <div className='descriptionX'>
              <img src={checkSVG} alt='' />
              <span>
                Your information was succesfully edited. Please wait a minute to appear on the
                website.
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className='buttonX' onClick={() => setEditSuccess(false)}>
                Done
              </div>
            </div>
          </div>
        </div>
      )}

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
              <div
                className='profile😢__button-edit mr-10'
                onClick={() => handleUploadImage('avatar')}
              >
                <img src={editSVG} alt='' />
                <span>Change Avatar</span>
              </div>
            )}

            {isEdit && (
              <div className='profile😢__button-edit' onClick={() => handleUploadImage('cover')}>
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
                alt=''
                style={convertPositionIMG(avatarPos)}
                onClick={(e) => setPreviewIMG(e.target.src)}
                src={avatar ? `${STORAGE_DOMAIN}${avatar}` : avatarDefault}
              />
              <span></span>
            </div>
          </div>
        </div>

        <div className='profile😢__name'>
          {!userName || userName === ' ' ? 'Username' : userName}
        </div>

        {isEdit && (
          <form onSubmit={handleEditUser} className='profile😢__edit-information'>
            <h3>Edit Information</h3>

            <div className='form-control'>
              <div className='label'>Last Name</div>
              <input type='text' name='last_name' defaultValue={lastName} />
            </div>

            <div className='form-control'>
              <div className='label'>First Name</div>
              <input type='text' name='first_name' defaultValue={firstName} />
            </div>

            <div className='form-control'>
              <div className='label'>Phone Number</div>
              <input type='text' name='phone' defaultValue={phone} />
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
                defaultValue={birthday}
              />
            </div>

            <div className='form-control'>
              <div className='label'>Address</div>
              <input type='text' name='address' defaultValue={address} />
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

                <div>
                  <div className='profile😢__title'>Live</div>

                  <div className='profile😢__introduce'>
                    <VideoPlayer guid={`7ba74ab1-fc07-4a55-8394-2a1b1f771049`} />

                    <div>
                      <div>Epic Riddles Marathon Only Bravest Detectives Can Pass</div>
                      <div>39 views • 8 days ago</div>
                      <div>
                        Are you a fan of solving different puzzles, sudoku or crosswords? Here's a
                        fresh set of riddles to entertain and train your brain. Let's see how many
                        you can crack and share your number down. Here's a fresh set of riddles to
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
                              <img src={menuSVG} alt='' />
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
                      <div
                        className='buttonTrade'
                        onClick={() =>
                          window.open('https://www.mexc.com/exchange/KDG_USDT', '_blank')
                        }
                      >
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
    </>
  )
}
