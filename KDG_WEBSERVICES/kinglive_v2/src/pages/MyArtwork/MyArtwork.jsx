import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import '../../assets/scss/my-artwork.scss'
import callAPI from '../../axios'
import { STORAGE_DOMAIN } from '../../constant'
import { ABIKL1155, addressKL1155 } from '../../contracts/KL1155'
import { paymentList } from '../../contracts/ERC20'
import { ABIMarket, addressMarket } from '../../contracts/Market'
import convertPositionIMG from '../../helpers/convertPositionIMG'

export default function MyArtwork() {
  const userRedux = useSelector((state) => state.user)
  const [status, setStatus] = useState(1)
  const [previewIMG, setPreviewIMG] = useState('')
  const [AssetList, setAssetList] = useState([])
  const [sellingItem, setSellingItem] = useState('')

  const isLoadMore = useRef(true)
  const isLoadingAPI = useRef(false)
  const [, setIsLoading] = useState(false)
  const [isApprovedForAll, setIsApprovedForAll] = useState(false)

  const [userData, setUserData] = useState({})
  const avatar = useMemo(() => userData?.kyc?.avatar?.path, [userData])
  const avatarPos = useMemo(() => userData?.kyc?.avatar_pos, [userData])
  const cover = useMemo(() => userData?.kyc?.cover?.path, [userData])
  const coverPos = useMemo(() => userData?.kyc?.cover_pos, [userData])
  const isReviewer = useMemo(() => userRedux?.isReviewer, [userRedux])
  const userName = useMemo(
    () => `${userData?.kyc?.first_name} ${userData?.kyc?.last_name}`,
    [userData]
  )

  const handleChangeStatus = async (status) => {
    setStatus(status)
    AssetList.length = 0
    await getAssets(status)
  }

  const handleApprove = async () => {
    if (window.web3.eth) {
      const approved = await new window.web3.eth.Contract(ABIKL1155, addressKL1155).methods
        .setApprovalForAll(addressMarket, true)
        .send({ from: window.ethereum.selectedAddress })
      if (approved) {
        setIsApprovedForAll(true)
      }
    }
  }

  const getAssets = useCallback(
    async (status) => {
      var ids = AssetList.map((o) => o._id)

      const res = await callAPI.get(
        `/user-asset?limit=20&${ids.length ? `ids=${ids}` : ''}&status=${status}`,
        true
      )

      if (res?.data?.length === 0) {
        isLoadMore.current = false
        setAssetList([...AssetList])
        return
      }

      setAssetList([...AssetList, ...(res?.data ? res.data : [])])
    },
    [AssetList]
  )

  useEffect(() => {
    const handleLoad = async () => {
      const totalHeight = document.getElementById('root').clientHeight
      const scrolledHeight = window.scrollY + window.innerHeight
      const restHeight = totalHeight - scrolledHeight
      const isEnd = restHeight <= 100

      if (isEnd && isLoadMore.current && !isLoadingAPI.current) {
        isLoadingAPI.current = true
        setIsLoading(true)
        await getAssets(status)
        setIsLoading(false)
        isLoadingAPI.current = false
      }
    }

    window.addEventListener('scroll', handleLoad)

    return () => {
      window.removeEventListener('scroll', handleLoad)
    }
  }, [getAssets, status])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await callAPI.get(`/user?uid=${userRedux?._id}`)
        console.log("res",res);
        setUserData(res.data)
      } catch (error) {}
    })()
  }, [userRedux])

  useEffect(() => {
    ;(async () => {
      callAPI.get(`/user-asset?limit=20&status=${status}`, true).then((res) => {
        setAssetList(res?.data ? res.data : [])
      })

      if (window.web3 && window.web3.eth && window.contractKL1155) {
          window.contractKL1155.methods
          .isApprovedForAll(window.ethereum.selectedAddress, addressMarket)
          .call()
          .then((approved) => {
            setIsApprovedForAll(approved)
          })
      }
    })()
  }, [status])

  const [isOpenSell, setIsOpenSell] = useState(false)

  const handleSell = async (e) => {
    e.preventDefault()
    const { Decimal } = require('decimal.js')
    const paymentToken = paymentList[e.target._paymentToken.value]
    const price = new Decimal(e.target._price.value)
      .mul(new Decimal(10).pow(paymentToken.decimal))
      .toHex()
      if(window.web3 && window.contractMarket){
        await window.contractMarket.methods
        .list(
          e.target._contract.value,
          e.target._id.value,
          new Decimal(e.target._quantity.value).toHex(),
          e.target._mask.value,
          price,
          paymentToken.address,
          100000000
        )
        .send({ from: window.ethereum.selectedAddress })
          AssetList.length = 0
          await getAssets(status) 
          setIsOpenSell(false)
      }
  }

  const handleSellButton = async (item) => {
    setIsOpenSell(true)
    setSellingItem(item)
  }

  const handleAccept = async (item) => {
    if(window.web3 && window.contractKL1155){
      const result = await window.contractKL1155.methods
      .reviewAsset(item.asset.id, true)
      .send({ from: window.ethereum.selectedAddress })
    if (result) {
      AssetList.length = 0
      await getAssets(status)
    }
    }
  }

  const handleDeny = async (item) => {
    if(window.web3 && window.contractKL1155){
      const result = await window.contractKL1155.Contract(ABIKL1155, addressKL1155).methods
        .reviewAsset(item.asset.id, false)
        .send({ from: window.ethereum.selectedAddress })
      if (result) {
        AssetList.length = 0
        await getAssets(status)
      }
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
      video.play()
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
  })

  return (
    <>
      {isOpenSell && (
        <div key={sellingItem?._id} className='popupX' onClick={() => setIsOpenSell(false)}>
          <form className='containerX' onSubmit={handleSell} onClick={(e) => e.stopPropagation()}>
            <div className='form-control'>
              <div class='label'>NFT</div>
              <input type='text' name='_name' readOnly value={sellingItem?.asset?.metadata?.name} />
              <input
                type='hidden'
                name='_contract'
                readOnly
                value={sellingItem?.asset?.collection_id}
              />
              <input type='hidden' name='_id' readOnly value={sellingItem?.asset?.id} />
            </div>
            <div className='form-control'>
              <div class='label'>Quantity</div>
              <input type='number' min='1' max={sellingItem.amount} name='_quantity' />
            </div>
            <div className='form-control'>
              <div class='label'>Mask</div>
              <select name='_mask'>
                <option value='1'>Sell</option>
                <option value='2'>Aution</option>
              </select>
            </div>
            <div className='form-control'>
              <div class='label'>Price</div>
              <input type='number' name='_price' />
            </div>
            <div className='form-control'>
              <div class='label'>Payment Token</div>
              <select name='_paymentToken'>
                {paymentList.map((pm, i) => (
                  <option value={i}>{pm.coin}</option>
                ))}
              </select>
            </div>
            <button type='submit' className='buttonX'>
              Confirm
            </button>
          </form>
        </div>
      )}

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
          </div>

          {AssetList?.length > 0 && (
            <div className='myartwork__list'>
              {AssetList.map((al) => (
                <div 
                onMouseOver={handleMouseOverNFT}
                onMouseOut={handleMouseOutNFT}
                key={'artwork' + al._id} className='myartwork__list-item'>
                  <div className='artwork'>
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

                      <span>{new Date(al.asset?.time * 1000).toDateString()}</span>
                    </div>
                  </div>
                  {status === 1 && isApprovedForAll > 0 && (
                    <div
                      key={'sell' + al._id}
                      className='buttonX'
                      onClick={() => handleSellButton(al)}
                    >
                      Sell
                    </div>
                  )}
                  {status === 1 && !isApprovedForAll > 0 && (
                    <div
                      key={'approve' + al._id}
                      className='buttonX'
                      onClick={() => handleApprove()}
                    >
                      Approval for sell
                    </div>
                  )}
                  {isReviewer && status === 0 && (
                    <div>
                      <div
                        key={'review' + al._id}
                        className='buttonX'
                        onClick={() => handleAccept(al)}
                      >
                        Accept
                      </div>
                      <div key={'deny' + al._id} className='buttonX' onClick={() => handleDeny(al)}>
                        Deny
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
