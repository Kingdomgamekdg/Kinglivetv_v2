import { useEffect, useMemo, useRef, useState } from 'react'
import ReactHlsPlayer from 'react-hls-player'
import { useHistory } from 'react-router-dom'
import '../../assets/scss/upload.scss'
import checkSVG from '../../assets/svg/check.svg'
import closeSVG from '../../assets/svg/close.svg'
import copySVG from '../../assets/svg/copy.svg'
import errorSVG from '../../assets/svg/error.svg'
import liveSVG from '../../assets/svg/live.svg'
import plusSVG from '../../assets/svg/plus.svg'
import callAPI from '../../axios'
import { PLAY_STREAM, RTMP_DOMAIN, STORAGE_DOMAIN } from '../../constant'
import socket from '../../socket'

const copyToClipboard = (value, e) => {
  let input = document.createElement('input')
  document.body.appendChild(input)
  input.value = value
  input.select()
  document.execCommand('copy')
  input.remove()

  let target = e.target
  while (!target.classList.contains('upload__copy')) {
    target = target.parentElement
  }
  target.nextElementSibling.classList.add('show')
  setTimeout(() => {
    target.nextElementSibling.classList.remove('show')
  }, 1000)
}

export default function Setup() {
  const history = useHistory()

  const thumbnailPreviewRef = useRef()
  const inputThumbnailRef = useRef()
  const tagsRef = useRef()
  const titleRef = useRef()
  const descRef = useRef()
  const defaultValueTags = useRef('KingdomGame, KDG, KingliveTv')

  const [endLiveSuccess, setEndLiveSuccess] = useState(false)
  const [changeStepError, setChangeStepError] = useState(false)

  const [streamData, setStreamData] = useState({})
  const streamKey = useMemo(() => streamData.key, [streamData])
  const streamID = useMemo(() => streamData._id, [streamData])
  const streamTags = useMemo(() => streamData.tags?.join(', '), [streamData])
  const status = useMemo(() => streamData.status, [streamData])
  const connect_status = useMemo(() => streamData.connect_status, [streamData])

  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => console.log({ streamData }), [streamData])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await callAPI.get('/stream')
        setStreamData(res.data)

        if (res.data.status === 1) setCurrentStep(2)
      } catch (error) {
        console.log('error get stream')
        console.log(error)
      }
    })()
  }, [])

  useEffect(() => {
    const handleStream = (data) => setStreamData(data)
    socket.on('stream', handleStream)
    return () => socket.removeEventListener('stream', handleStream)
  }, [])

  const handlePreviewThumbnail = (e) => {
    const files = e.target.files || []
    if (!files.length) return

    const reader = new FileReader()
    reader.onload = (e) => {
      thumbnailPreviewRef.current.src = e.target.result
      thumbnailPreviewRef.current.style.opacity = 1
    }
    reader.readAsDataURL(files[0])
  }

  const handleClearInput = () => {
    inputThumbnailRef.current.value = ''

    thumbnailPreviewRef.current.src = ''
    thumbnailPreviewRef.current.style.opacity = 0

    tagsRef.current.value = defaultValueTags.current
    titleRef.current.value = ''
    descRef.current.value = ''
  }

  const handlePublicStream = async (e) => {
    e.preventDefault()

    const data = new FormData(e.target)
    try {
      await callAPI.post(`/public_stream?sid=${streamID}`, data)
    } catch (error) {
      console.log('error live now')
      console.log(error)
    }
  }

  const handleStopStream = async () => {
    try {
      await callAPI.post(`/stop_stream?sid=${streamID}`)
      setEndLiveSuccess(true)
    } catch (error) {
      console.log('error end live')
      console.log(error)
    }
  }

  const handleEndLiveSuccess = () => {
    setEndLiveSuccess(false)
    handleClearInput()
    setCurrentStep(1)
  }

  const handleChangeStep = (step) => {
    if (step === 1) return setCurrentStep(1)

    if (status === 1) return setCurrentStep(step)
    if (connect_status === 1) return setCurrentStep(step)

    if (step === 2) {
      if (
        inputThumbnailRef.current.value &&
        tagsRef.current.value &&
        titleRef.current.value &&
        descRef.current.value
      ) {
        setCurrentStep(2)
      } else {
        setChangeStepError(true)
      }
    }
  }

  return (
    <>
      <form className='upload container' onSubmit={handlePublicStream}>
        {endLiveSuccess && (
          <div className='upload__popup'>
            <div className='container😀'>
              <img className='close😀' src={closeSVG} alt='' onClick={handleEndLiveSuccess} />
              <div className='title😀'>Success!</div>
              <div className='description😀'>
                <img src={checkSVG} alt='' />
                <span>End the livestream session on KingliveTv successfully.</span>
              </div>
              <div className='upload__button button😀' onClick={handleEndLiveSuccess}>
                Done
              </div>
            </div>
          </div>
        )}

        {changeStepError && (
          <div className='upload__popup'>
            <div className='container😀'>
              <img
                className='close😀'
                src={closeSVG}
                alt=''
                onClick={() => setChangeStepError(false)}
              />
              <div className='title😀'>Error!</div>
              <div className='description😀'>
                <img src={errorSVG} alt='' />
                <span>Please fill out all fields and upload thumbnail!</span>
              </div>
              <div
                className='upload__button button😀 ok😀'
                onClick={() => setChangeStepError(false)}
              >
                OK
              </div>
            </div>
          </div>
        )}

        <p className='upload__title'>Live Now</p>

        <p className='upload__description mb-25'>
          <span>Setup information. Ensure that there are no violent or counter-revolutionary</span>
          <span>actions and words during the livestream process.</span>
          <span>Do not use famous artist's image without permission</span>
        </p>

        <div className='upload__step mb-25'>
          <div className='stepItem active' onClick={() => handleChangeStep(1)}>
            <span className='mb-10'>1</span>
            <span>Set up</span>
          </div>

          <div className={`hr ${currentStep === 2 ? 'active' : ''}`}></div>

          <div
            className={`stepItem ${currentStep === 2 ? 'active' : ''}`}
            onClick={() => handleChangeStep(2)}
          >
            <span className='mb-10'>2</span>
            <span>Connect your livestream</span>
          </div>
        </div>

        <div className='upload__layout mb-50'>
          <div className='upload__left'>
            <div className='upload__label'>Preview livestream</div>

            <div className='upload__video mb-25'>
              {connect_status === 1 && (
                <ReactHlsPlayer
                  className='previewStream'
                  src={`${PLAY_STREAM}${streamKey}/index.m3u8`}
                  autoPlay={true}
                  controls={true}
                  muted
                  width='100%'
                  height='auto'
                />
              )}
              <img src={liveSVG} alt='' />
              <span>Not yet connected to OBS</span>
            </div>

            <div className='upload__label'>Enter up to 3 tags, separate by “,”</div>

            <input
              name='tags'
              ref={tagsRef}
              className='upload__input mb-25'
              type='text'
              placeholder='Enter tags for livestream'
              defaultValue={status === 1 ? streamTags : defaultValueTags.current}
              disabled={status === 1}
            />

            <div className='upload__label'>Thumbnail livestream</div>

            <div className='upload__thumbDesc mb-10'>
              Please use the format JPG, JPEG, PNG. Maximum file size: 2MB. To make sure images
              engage viewers, please use sharp images.
            </div>

            <div className='upload__thumbnail'>
              <input
                disabled={status === 1}
                name='thumbnail'
                ref={inputThumbnailRef}
                type='file'
                accept='.jpg,.jpeg,.png'
                onInput={handlePreviewThumbnail}
              />
              <img
                className='preview'
                ref={thumbnailPreviewRef}
                style={{ opacity: status === 1 ? 1 : 0 }}
                src={status === 1 ? `${STORAGE_DOMAIN}${streamData.thumbnail?.path}` : ''}
                alt=''
              />
              <img src={plusSVG} alt='' />
            </div>
          </div>

          <div className={`upload__right ${currentStep === 2 ? 'rotate' : ''}`}>
            <div className='rotate3D'>
              <div className='upload__label'>Title livestream</div>

              <input
                name='name'
                ref={titleRef}
                className='upload__input mb-25'
                type='text'
                placeholder='Enter title for livestream'
                defaultValue={status === 1 ? streamData.name : ''}
                disabled={status === 1}
              />

              <div className='upload__label'>Add a description</div>

              <textarea
                name='description'
                ref={descRef}
                className='upload__textarea'
                placeholder='Enter description for livestream'
                defaultValue={status === 1 ? streamData.description : ''}
                disabled={status === 1}
              ></textarea>

              <div className='buttonX mt-20' onClick={() => handleChangeStep(2)}>
                Next
              </div>
            </div>

            <div className='rotate3D'>
              <div className='upload__label'>Server URL</div>

              <div style={{ position: 'relative' }}>
                <input
                  className='upload__input mb-25'
                  type='text'
                  defaultValue={RTMP_DOMAIN}
                  disabled
                />
                <div className='upload__copy' onClick={(e) => copyToClipboard(RTMP_DOMAIN, e)}>
                  <img src={copySVG} alt='' />
                </div>
                <div className='upload__copynoti'>Copied!</div>
              </div>

              <div className='upload__label'>Stream Key</div>

              <div style={{ position: 'relative' }}>
                <input
                  className='upload__input mb-25'
                  type='text'
                  defaultValue={streamKey}
                  disabled
                />
                <div className='upload__copy' onClick={(e) => copyToClipboard(streamKey, e)}>
                  <img src={copySVG} alt='' />
                </div>
                <div className='upload__copynoti'>Copied!</div>
              </div>

              {status === 0 && connect_status === 0 && (
                <div className='upload__message'>Please connect OBS</div>
              )}

              {status === 0 && connect_status === 1 && (
                <button className='upload__button mr-20' type='submit'>
                  Live now
                </button>
              )}

              {status === 1 && connect_status === 1 && (
                <p className='upload__message'>
                  <span onClick={() => history.push(`/watchlive?s=${streamID}`)}>
                    You are live streaming now
                  </span>
                  . Please stop OBS livestream or disconnect OBS to end the livestream session on
                  KingliveTv
                </p>
              )}

              {status === 1 && connect_status === 0 && (
                <>
                  <p className='upload__message mb-25'>
                    Livestream is paused. Please reconnect to continue or click the button below to
                    end the livestream session on KingliveTv
                  </p>
                  <div
                    className='upload__button upload__button--cancel mr-20'
                    onClick={handleStopStream}
                  >
                    End livestream
                  </div>
                </>
              )}

              <div className='buttonX mt-20' onClick={() => handleChangeStep(1)}>
                Previous
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
