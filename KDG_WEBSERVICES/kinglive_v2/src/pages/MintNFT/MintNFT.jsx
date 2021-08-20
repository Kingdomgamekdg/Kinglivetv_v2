import { useEffect, useRef, useState } from 'react'

import '../../assets/scss/mint-nft.scss'
import checkSVG from '../../assets/svg/check.svg'
import closeSVG from '../../assets/svg/close.svg'
import errorSVG from '../../assets/svg/error.svg'
import uploadSVG from '../../assets/svg/upload.svg'
import callAPI from '../../axios'
import {  addressKL1155 } from '../../contracts/KL1155'
import { useContractKL1155, useContractERC20 , useContractMarket} from '../../components/ConnectWalletButton/contract'
import { useWeb3React } from '@web3-react/core'


export default function MintNFT() {
  const inputVideoRef = useRef()
  const videoPreviewRef = useRef()
  const imagePreviewRef = useRef()
  const titleRef = useRef()
  const descRef = useRef()
  const { account } = useWeb3React()
  const contractKL1155 = useContractKL1155()
  const contractERC20 = useContractERC20()
  const [isApproval, setIsApproval] = useState(false)
  const [file, setFile] = useState([])
  const [percent, setPercent] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadNotSelected, setUploadNotSelected] = useState(false)
  const [uploadError, setUploadError] = useState(false)

  useEffect(() => {
    async function getAllowance() {
      if(!account) return
        const allowance = await contractERC20.methods
          .allowance(account, addressKL1155)
        if (Number(allowance) >= 20000000000000000000) {
          setIsApproval(true)
        }
    }
    getAllowance()
  }, [])

  const handlePreviewVideo = async (e) => {
    const files = e.target.files || []

    if (!files.length) return

    titleRef.current.value = files[0].name.replace('.mp4', '')
    descRef.current.value = files[0].name.replace('.mp4', '')
    setFile(files[0])
    const reader = new FileReader()
    reader.onload = (e) => {
      console.log(files[0])
      if (files[0].type.includes('video')) {
        videoPreviewRef.current.src = e.target.result
        videoPreviewRef.current.load()
        videoPreviewRef.current.play()
        return
      }
      imagePreviewRef.current.src = e.target.result
    }

    reader.readAsDataURL(files[0])
  }

  const handleApproval = async () => {
    if(!account) setIsApproval(false)

    const approval = await contractERC20.methods
      .approve(addressKL1155, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
      if (approval) {
        setIsApproval(true)
      }else {
        setIsApproval(false)
      }
  }

  const handleClearInput = () => {
    inputVideoRef.current.value = ''
    videoPreviewRef.current.src = ''
    titleRef.current.value = ''
    descRef.current.value = ''
  }

  const handleMintNFT = async (e) => {
    e.preventDefault()

    if (isUploading) return
    setIsUploading(true)

    const data = new FormData()
    data.append('file', file)
    data.append('name', e.target.name.value)
    data.append('numEditions', e.target.numEditions.value)
    data.append('description', e.target.description.value)

    let res

    try {
      res = await callAPI.post('/ipfs', data, false, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (e) => {
          if (e.lengthComputable) {
            let percent = Math.round((e.loaded / e.total) * 100)
            setPercent(percent)
            // console.log({ percent, loaded: e.loaded, total: e.total })
          }
        },
      })

      if(!account) return

      if (res?.data?.hashes[0]) {
        const transaction = await contractKL1155.methods
          .create(
            e.target.numEditions.value,
            e.target.numEditions.value,
            2500,
            res?.data?.hashes[0],
            '0x00'
        )
        if (transaction) {
          // console.log('upload thanh cong')
          setUploadSuccess(true)
        }
      }
    } catch (error) {
      console.log('catch error upload', error)
      setUploadError(true)
    }

    if (res.status === 100) {
      // console.log('chua chon video')
      setUploadNotSelected(true)
    }

    if (res.status === 0) {
      // console.log('loi kh1ong xac dinh')
      setUploadError(true)
    }

    // console.log({ res })
    setPercent(0)
    setIsUploading(false)
  }

  const handleUploadSuccess = () => {
    setUploadSuccess(false)
    handleClearInput()
  }

  return (
    <>
      <form className='upload mint-nft container' onSubmit={handleMintNFT}>
        {percent > 0 && (
          <div className='upload__loading'>
            <div className='circle'>
              <div className='percent'>{percent}%</div>
              <svg style={{ '--percent': percent }}>
                <circle
                  cx='100'
                  cy='100'
                  r='95'
                  fill='none'
                  stroke='rgba(255, 255, 255, 0.05)'
                  strokeWidth='10'
                  strokeLinecap='round'
                ></circle>
                <circle
                  cx='100'
                  cy='100'
                  r='95'
                  fill='none'
                  stroke='rgba(255, 255, 255, 1)'
                  strokeWidth='10'
                  strokeLinecap='round'
                ></circle>
              </svg>
            </div>
          </div>
        )}

        {uploadSuccess && (
          <div className='upload__popup'>
            <div className='container😀'>
              <img className='close😀' src={closeSVG} alt='' onClick={handleUploadSuccess} />
              <div className='title😀'>Your file was uploaded!</div>
              <div className='description😀'>
                <img src={checkSVG} alt='' />
                <span>
                  Your file was succesfully uploaded. Please wait a minute to appear on the website.
                </span>
              </div>
              <div className='upload__button button😀' onClick={handleUploadSuccess}>
                Done
              </div>
            </div>
          </div>
        )}

        {uploadNotSelected && (
          <div className='upload__popup'>
            <div className='container😀'>
              <img
                className='close😀'
                src={closeSVG}
                alt=''
                onClick={() => setUploadNotSelected(false)}
              />
              <div className='title😀'>Uploading has failed!</div>
              <div className='description😀'>
                <img src={errorSVG} alt='' />
                <span>
                  Uploading has failed. You haven't selected a video yet. Please check it again to
                  complete.
                </span>
              </div>
              <div
                className='upload__button button😀 ok😀'
                onClick={() => setUploadNotSelected(false)}
              >
                OK
              </div>
            </div>
          </div>
        )}

        {uploadError && (
          <div className='upload__popup'>
            <div className='container😀'>
              <img
                className='close😀'
                src={closeSVG}
                alt=''
                onClick={() => setUploadError(false)}
              />
              <div className='title😀'>Uploading has failed!</div>
              <div className='description😀'>
                <img src={errorSVG} alt='' />
                <span>Something went wrong. Please try again later!</span>
              </div>
              <div className='upload__button button😀 ok😀' onClick={() => setUploadError(false)}>
                OK
              </div>
            </div>
          </div>
        )}

        <p className='upload__title'>Create New NFT</p>

        <p className='upload__description mb-50'>
          <span>Image, Video, Audio or Video 3D.</span>
          <span>File types supported JPG, PNG, GIF, MP4</span>
          <span>Max size: 10MB</span>
        </p>

        <div className='mint-nft__layout mb-50'>
          <div className='mint-nft__left'>
            <div className='mint-nft__video mb-25'>
              <input
                name='file'
                ref={inputVideoRef}
                type='file'
                accept='.mp4,.png,.jpg,.gif'
                onInput={handlePreviewVideo}
              />
              <video
                className={`${file?.type?.includes('video') ? 'show' : ''}`}
                ref={videoPreviewRef}
              ></video>
              <img
                className={`preview-image ${file?.type?.includes('image') ? 'show' : ''}`}
                ref={imagePreviewRef}
                alt=''
              />
              <img src={uploadSVG} alt='' />
              <span>Drap and drop video file</span>
            </div>

            <div className='upload__label'>Amount to mint</div>

            <input
              name='numEditions'
              className='upload__input mb-25'
              type='number'
              placeholder='1'
              defaultValue='1'
            />
          </div>

          <div className='upload__right'>
            <div className='upload__label'>Name</div>

            <input
              name='name'
              ref={titleRef}
              className='upload__input mb-25'
              type='text'
              placeholder='Enter title for video'
            />

            <div className='upload__label'>Add a description</div>

            <textarea
              name='description'
              ref={descRef}
              className='upload__textarea'
              placeholder='Enter description for video'
            ></textarea>
          </div>
        </div>

        {!isUploading && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {isApproval && (
              <button type='submit' className='upload__button mr-15'>
                Upload
              </button>
            )}
            {!isApproval && (
              <button className='upload__button mr-15' onClick={() =>handleApproval()}>
                Approve
              </button>
            )}
            <div className='upload__button upload__button--cancel' onClick={()=>handleClearInput()}>
              Cancel
            </div>
          </div>
        )}
      </form>
    </>
  )
}
