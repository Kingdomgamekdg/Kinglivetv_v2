import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import '../../assets/scss/my-artwork.scss'
import callAPI from '../../axios'
import { STORAGE_DOMAIN } from '../../constant'

import convertPositionIMG from '../../helpers/convertPositionIMG'

export default function MyArtwork() {
  const userRedux = useSelector((state) => state.user)
  const history = useHistory()
  const [status, setStatus] = useState(1)
  const [previewIMG, setPreviewIMG] = useState('')
  const [AssetList, setAssetList] = useState([])
  const [mimetype, setMimetype] = useState('')

  const isLoadMore = useRef(true)
  const isLoadingAPI = useRef(false)

  const [userData, setUserData] = useState({})
  const avatar = useMemo(() => userData?.kyc?.avatar?.path, [userData])
  const avatarPos = useMemo(() => userData?.kyc?.avatar_pos, [userData])
  const cover = useMemo(() => userData?.kyc?.cover?.path, [userData])
  const coverPos = useMemo(() => userData?.kyc?.cover_pos, [userData])
  const userName = useMemo(
    () => `${userData?.kyc?.first_name} ${userData?.kyc?.last_name}`,
    [userData]
  )
  const address = useMemo(() => userRedux?.address, [userRedux])

  const handleChangeStatus = async (status) => {
    setStatus(status)
    AssetList.length = 0
    await getAssets()
  }

  // const handleChangeMimeType = async (mimetype) => {
  //   setMimetype(mimetype)
  //   AssetList.length = 0
  //   await getAssets()
  // }


  const getAssets = useCallback(
    async () => {
      if(status === 3 )
      {
        const ids = AssetList.map((o) => o._id)
        const res = await callAPI.get(
          `/buys/bidding?limit=20&${ids.length ? `ids=${ids}` : ''}&${mimetype.length ? `mimetype=${mimetype}` : ''}`,
          true) 
        if (res?.data?.length === 0) {
          isLoadMore.current = false
          setAssetList([...AssetList])
          return
        } else {
          const bidings = res?.data.map(bid =>{
            return {
              _id: bid._id,
              user :bid.from,
              asset: bid.asset,
              listId: bid.list_id?._id,
              amount:bid.quantity
            }
          })
          setAssetList([...AssetList, ...bidings])
        }
      } else if(status === 4)
      {
        const ids = AssetList.map((o) => o._id)
        const res = await callAPI.get(
          `/listing-assets?limit=20&${ids.length ? `ids=${ids}` : ''}&${mimetype.length ? `mimetype=${mimetype}` : ''}`,
          true) 
        if (res?.data?.length === 0) {
          isLoadMore.current = false
          setAssetList([...AssetList])
          return
        } else {
          const listing = res?.data.map(list =>{
            return {
              _id: list._id,
              user :list.owner,
              asset: list.asset,
              listId: list._id,
              amout:list.quantity
            }
          })
          setAssetList([...AssetList, ...listing])
        }
      } else {
        const ids = AssetList.map((o) => o._id)
        const res = await callAPI.get(
          `/user-asset?limit=20&${ids.length ? `ids=${ids}` : ''}&status=${status}&${mimetype.length ? `mimetype=${mimetype}` : ''}`,
          true) 
        if (res?.data?.length === 0) {
          isLoadMore.current = false
          setAssetList([...AssetList])
          return
        }
        setAssetList([...AssetList, ...(res?.data ? res.data : [])])

      }
      
    },
    [AssetList,status,mimetype]
  )

  

  useEffect(() => {
    const handleLoad = async () => {
      const totalHeight = document.getElementById('root').clientHeight
      const scrolledHeight = window.scrollY + window.innerHeight
      const restHeight = totalHeight - scrolledHeight
      const isEnd = restHeight <= 100

      if (isEnd && isLoadMore.current && !isLoadingAPI.current) {
        isLoadingAPI.current = true
        await getAssets()
        isLoadingAPI.current = false
      }
    }

    window.addEventListener('scroll', handleLoad)

    return () => {
      window.removeEventListener('scroll', handleLoad)
    }
  }, [getAssets])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await callAPI.get(`/user?uid=${userRedux?._id}`)
        setUserData(res.data)
      } catch (error) {}
    })()
  }, [userRedux])

  useEffect(() => {
    ;(async () => {
      try {
        setStatus(1)
        setMimetype('')
        const res = await callAPI.get(
          `/user-asset?limit=20&status=1`,
          true) 
        setAssetList(res.data)  
      } catch (error) {}
    })()
  }, [address])



  

  const handleShowDetail = async (index) => {
    if(status === 3 || status === 4 ){
      const ids = AssetList.map((o) => o?.listId)
      history.push(`/nft-detail?ids=${ids}&index=${index}`)
    } else {
      const ids = AssetList.map((o) => o?._id)
      history.push(`/my-artwork-detail?ids=${ids}&index=${index}`)
    }
  }


  const handleMouseOverNFT = useCallback((e) => {
    let target = e.target
    while (true) {
      const targetClassList = Array.from(target.classList)
      if(targetClassList.includes('myartwork__list-item')) {
        break
      }
      target = target.parentElement
    }
    target.classList.add('active-video')
    const video = target.querySelector('video')
    if(video) {
      var isPlaying = video.currentTime > 0 && !video.paused && !video.ended 
      && video.readyState > video.HAVE_CURRENT_DATA;
      if(!isPlaying){
        video.play()
      }
    }
  },[])

  const handleMouseOutNFT = useCallback((e) => {
    let target = e.target
    while (true) {
      const targetClassList = Array.from(target.classList)
      if(targetClassList.includes('myartwork__list-item')) {
        break
      }
      target = target.parentElement
    }
    target.classList.remove('active-video')
    const video = target.querySelector('video')
    if(video) {
      video.pause()
      video.currentTime=0
  }
  },[])

  return (
    <>

              
      <div className='myartwork profile😢 container'>
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

        <div className='profile😢__name'>
          {!userName || userName === ' ' ? 'Username' : userName}
        </div>

        <div className='myartwork__container mt-35'>
          <div className='myartwork__tabs'>
            <div
              className={`myartwork__tab ${status === 1 ? 'active' : ''}`}
              onClick={() => handleChangeStatus(1)}
            >
              Reviewed <span>Reviewed</span>{' '}
            </div>
            <div
              className={`myartwork__tab ${status === 0 ? 'active' : ''}`}
              onClick={() => handleChangeStatus(0)}
            >
              Pending <span>Pending</span>{' '}
            </div>
            <div
              className={`myartwork__tab ${status === 2 ? 'active' : ''}`}
              onClick={() => handleChangeStatus(2)}
            >
              Reject <span>Reject</span>{' '}
            </div>
            <div
              className={`myartwork__tab ${status === 3 ? 'active' : ''}`}
              onClick={() => handleChangeStatus(3)}
            >
              Bidding <span>Bidding</span>{' '}
            </div>
            <div
              className={`myartwork__tab ${status === 4 ? 'active' : ''}`}
              onClick={() => handleChangeStatus(4)}
            >
              On Sale <span>On Sale</span>{' '}
            </div>
          </div>
          
          {/* <div className="myartwork__filterBlock">
                
                <div className="select">
   
                    <input type="radio" name="option" />
                      <i className="toggle icon icon-arrow-down"></i>
                      <i className="toggle icon icon-arrow-up"></i>
                      <span className="placeholder">Option</span>
                      <label className="option">
                          <input type="radio" name="option" onClick={()=> handleChangeMimeType('')} />
                          <span className="title ">All type</span>
                      </label>
                      <label className="option">
                          <input type="radio" name="option" onClick={()=> handleChangeMimeType('gift')}/>
                          <span className="title ">Gift</span>
                      </label>
                      <label className="option">
                          <input type="radio" name="option" onClick={()=> handleChangeMimeType('video')} />
                          <span className="title ">Video</span>
                      </label>
                      <label className="option">
                          <input type="radio" name="option" onClick={()=> handleChangeMimeType('image')}/>
                          <span className="title ">Image</span>
                      </label>
               
                </div>
   
                <span>Short by</span>
              </div> */}
             
          {AssetList?.length > 0 && (
            <div className='myartwork__list'>
                
              {AssetList.map((al,index) => (
                <div 
                onMouseOver={handleMouseOverNFT}
                onMouseOut={handleMouseOutNFT}
                key={'artwork' + al._id} className='myartwork__list-item'>
                  <div className='artwork' onClick={() => handleShowDetail(index)}>
                      {al.asset?.metadata?.mimetype.startsWith('image') && (
                         <div className='img'>
                            <img key={'image' + al._id} src={al.asset?.metadata?.image} alt='' />
                         </div>

                      )}
                      {al.asset?.metadata?.mimetype.startsWith('video/mp4') && (
                        <>
                          <div className='video'>
                            <img key={'image' + al._id} src={al.asset?.metadata?.image} alt='' />
                            <video muted autoPlay key={'video' + al._id} src={al.asset?.metadata?.animation_url} alt='' />
                         </div>
                        </>
                        )}
                    <div key={'type' + al._id} className='type'>
                      {al.asset?.metadata?.mimetype}
                    </div>
                    <div key={'name' + al._id} className='name'>
                      {al.asset?.metadata?.name}
                    </div>
                    <div key={'quantity' + al._id} className='quantity'>
                      {al.amount}
                    </div>
                    <div key={'createday' + al._id} className='create-date'>
                      <svg
                        width='14'
                        height='14'
                        viewBox='0 0 14 14'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M7 0C3.14027 0 0 3.14027 0 7C0 10.8597 3.14027 14 7 14C10.8597 14 14 10.8597 14 7C14 3.14027 10.8597 0 7 0ZM7 13.125C3.62262 13.125 0.875004 10.3774 0.875004 7C0.875004 3.62262 3.62262 0.875004 7 0.875004C10.3774 0.875004 13.125 3.62262 13.125 7C13.125 10.3774 10.3774 13.125 7 13.125Z'
                          fill='#6A6A6D'
                        />
                        <path
                          d='M7.4375 2.625H6.5625V7.18114L9.31567 9.93431L9.93432 9.31566L7.4375 6.81884V2.625Z'
                          fill='#6A6A6D'
                        />
                      </svg>
                      <span>{new Date(al.asset?.time).toDateString()}</span>
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
