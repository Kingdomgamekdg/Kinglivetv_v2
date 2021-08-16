import { useCallback, useEffect, useMemo, useRef, useState , Component} from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import 'swiper/swiper.scss';
import "swiper/components/navigation/navigation.min.css"
import SwiperCore, {Navigation , Lazy} from 'swiper/core';
import arrowLeft from '../../assets/images/nft-market/arrow-left.png'
import imgSlide from '../../assets/images/nft-market/img-slide.png'
import zoom from '../../assets/images/nft-market/zoom.png'
import '../../assets/scss/my-artwork-detail.scss'
import address from '../../assets/images/nft-market/Vector.png'
import callAPI from '../../axios'
import { ABIKL1155, addressKL1155 } from '../../contracts/KL1155'
import { paymentList } from '../../contracts/ERC20'
import { ABIMarket, addressMarket } from '../../contracts/Market'
const MyArtworkDetail = () => {
    const userRedux = useSelector((state) => state.user)
    const ids = new URLSearchParams(window.location.search).get('ids')
    const index = new URLSearchParams(window.location.search).get('index')
    const history = useHistory()
    if (!ids) history.push('/my-artwork')
    const [userAssetList, setUserAssetList] = useState([])
    const [currentIndex, setCurrentIndex] = useState(Number(index))
    const [isOpenSell, setIsOpenSell] = useState(false)
    const [isApprovedForAll, setIsApprovedForAll] = useState(false)
    const isReviewer = useMemo(() => userRedux?.isReviewer, [userRedux])
    const address = useMemo(() => userRedux?.address, [userRedux])
    const isOwner = useMemo(() => userRedux?.address==userAssetList[currentIndex]?.user?.address, [userAssetList,currentIndex])

    useEffect(() => {
        ;(async () => {
          try {
            const res = await callAPI.get(`/user-assets-by-ids?ids=${ids}`)
            setUserAssetList(res?.data?res.data:[])
          } catch (error) {}

          if (window.web3 && window.web3.eth && window.contractKL1155) {
            window.contractKL1155.methods
            .isApprovedForAll(window.ethereum.selectedAddress, addressMarket)
            .call()
            .then((approved) => {
              setIsApprovedForAll(approved)
            })
          }
        })()
      }, [currentIndex,address])


    SwiperCore.use([Navigation , Lazy]);

    const ContentSwiper = (userAssetList) => {
        const list=[];
        userAssetList.map((userAsset,index)=>{
            const key=`swiper-slide${index}`
            list.push(
                <SwiperSlide key={key}>
                     <div className="item-swiper-content">
                        <img src={userAsset?.asset?.metadata?.image_preview} alt="" />
                    </div>
                </SwiperSlide>
            )
        })
        return list;
    }
    
    const SwiperComponent = () =>{
        const swiper = (
            <Swiper 
                loop={true}
                lazy={true}
                navigation={true}
                spaceBetween={0}
                slidesPerView={1}
                initialSlide={currentIndex}
                onSlideChange={(swiper) => {setCurrentIndex(swiper.realIndex)}}
                onSwiper={()=>{}}
            >{ContentSwiper(userAssetList)}
            </Swiper>
        )
        return swiper;
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

          }
      }
    
      // const handleSellButton = async (item) => {
      //   setIsOpenSell(true)
      //   setSellingItem(item)
      // }
    
      const handleAccept = async () => {
        if(window.web3 && window.contractKL1155){
          const result = await window.contractKL1155.methods
          .reviewAsset(userAssetList[currentIndex].asset.id, true)
          .send({ from: window.ethereum.selectedAddress })
        if (result) {
            userAssetList[currentIndex].asset.status = 1
        }
        }
      }


      const handleReject = async () => {
        if(window.web3 && window.contractKL1155){
          const result = await window.contractKL1155.Contract(ABIKL1155, addressKL1155).methods
            .reviewAsset(userAssetList[currentIndex].asset.id, false)
            .send({ from: window.ethereum.selectedAddress })
          if (result) {
            userAssetList[currentIndex].asset.status = 2
          }
        }
      }

    return (
            <>
                {isOpenSell && (
                    <div key={userAssetList[currentIndex]?._id} className='popupX' onClick={() => setIsOpenSell(false)}>
                    <form className='containerX' onSubmit={handleSell} onClick={(e) => e.stopPropagation()}>
                        <div className='form-control'>
                        <img className='preview-image 25mb' src={userAssetList[currentIndex]?.asset?.metadata?.image} alt='' />
                        <div class='label'>NFT</div>
                        <input type='text' name='_name' readOnly value={userAssetList[currentIndex]?.asset?.metadata?.name} />
                        <input
                            type='hidden'
                            name='_contract'
                            readOnly
                            value={userAssetList[currentIndex]?.asset?.collection_id}
                        />
                        <input type='hidden' name='_id' readOnly value={userAssetList[currentIndex]?.asset?.id} />
                        </div>
                        <div className='form-control'>
                        <div class='label'>Quantity</div>
                        <input type='number' min='1' max={userAssetList[currentIndex].amount} name='_quantity' />
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
                <div className="main-wrapper">
                    <div className="box-slide-artwork">
                        <div className="box-return" onClick={() => history.push('/my-artwork')}>
                            <img src={arrowLeft} alt="" /> 
                            <span className="text-return">{userAssetList[currentIndex]?.asset?.metadata?.name}</span>
                        </div>
                       <SwiperComponent/>
                        <div className="box-img" onClick={()=> window.open(userAssetList[currentIndex]?.asset?.metadata?.image,'_blank')}>
                            <img src={zoom} alt="" />
                        </div>
                    </div>
                    <div className="box-artist-wrapper">
                    <div className="artist-content">
                        <div className="artist-content-top">
                            <p className="text-artist">
                                Artists
                            </p>
                            <h2 className="title-artist">
                                {userAssetList[currentIndex]?.asset?.metadata?.name}
                            </h2>
                            <p className="desc-artist">
                                {/* <span className="desc">
                                    100,000 KDG
                                </span>
                                <span className="txt">
                                    $1000
                                </span> */}
                                <span className="txt">
                                    {userAssetList[currentIndex]?.amount} of {userAssetList[currentIndex]?.asset.total_editions}
                                </span>
                            </p> 
                        </div>
                        <div className="artist-content-body">
                            <div className="desciption-artist">
                                <p className="desc">
                                    Artist: <span className="color-fff"> {userAssetList[currentIndex]?.user?.kyc?.last_name?userAssetList[currentIndex]?.user?.kyc?.last_name + ' '+userAssetList[currentIndex]?.user?.kyc?.first_name:userAssetList[currentIndex]?.user?.address   } </span>
                                </p>
                                {/* <p className="desc">
                                    Size: <span className="color-fff"> 366x435px </span>
                                </p> */}
                                <p className="desc">
                                    Created: <span className="color-fff"> {new Date(userAssetList[currentIndex]?.asset?.time*1000).toDateString()}</span>
                                </p>
                                <p className="desc mar-t-10">
                                    Description: 
                                    <span className="color-fff d-block mar-t-10"> 
                                    {userAssetList[currentIndex]?.asset?.metadata?.description}
                                    </span>
                                    <span className="color-fff d-block mar-t-10"> 
                                        NFT coins: BSCS
                                    </span>
                                    <span className="color-fff d-block mar-t-10"> 
                                        Channel: KingLive
                                    </span>
                                    <span className="color-blue d-block mar-t-10"> 
                                        #characters #weapon #pat
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="artist-content-bottom">
                            <div className="artist-contract">
                                <div className="contract-item">
                                    <p className="text-contract">
                                        NFT Contract ID:
                                    </p>
                                    <p className="address-contract">
                                        {userAssetList[currentIndex]?.asset?.collection_id?.substring(0,5)+ '...' +userAssetList[currentIndex]?.asset?.collection_id?.substring(userAssetList[currentIndex]?.asset?.collection_id.length-9,userAssetList[currentIndex]?.asset?.collection_id.length) } <img src={address} alt="" /> 
                                    </p>
                                </div>
                                <div className="contract-item">
                                    <p className="text-contract">
                                        Token ID:
                                    </p>
                                    <p className="address-contract">
                                    {userAssetList[currentIndex]?.asset?.id } <img src={address} alt="" /> 
                                    </p>
                                </div>
                                <div className="contract-item">
                                    <p className="text-contract">
                                        Creator's Address:
                                    </p>
                                    <p className="address-contract">
                                        {userAssetList[currentIndex]?.user?.address.substring(0,5)+ '...' +userAssetList[currentIndex]?.user?.address.substring(userAssetList[currentIndex]?.user?.address.length-9,userAssetList[currentIndex]?.user?.address.length) }  <img src={address} alt="" /> 
                                    </p>
                                </div>
                            </div>
                        </div>
                        {isOwner && isApprovedForAll && userAssetList[currentIndex]?.asset?.status === 1 && (
                            <div className="artist-content-button">
                            <button type="button" className="btn-sell" onClick={()=> setIsOpenSell(true)}>
                                Sell
                            </button>
                        </div>
                        )} 

                        {isOwner && !isApprovedForAll && userAssetList[currentIndex]?.asset?.status === 1 && (
                            <div className="artist-content-button">
                            <button type="button" className="btn-sell" onClick={()=> handleApprove()}>
                                Approval for sell
                            </button>
                        </div>
                        )} 

                        {isReviewer && userAssetList[currentIndex]?.asset?.status===0 && (
                            <div className="artist-content-button">
                            <button type="button" className="btn-accept" onClick={()=> handleAccept()}>
                                Accept
                            </button>
                            <button type="button" className="btn-reject" onClick={()=> handleReject()}>
                                Reject
                            </button>
                        </div>
                        )} 

                        {isReviewer && !isOwner && userAssetList[currentIndex]?.asset?.status===2 && (
                            <div className="artist-content-status-reject">
                                Rejected
                            </div>
                        )} 
                        {isReviewer && !isOwner && userAssetList[currentIndex]?.asset?.status===1 && (
                            <div className="artist-content-status-accept">
                                Accepted
                            </div>
                        )} 
                
                    </div>
                </div>
                </div>
            </>
    )
}


export default MyArtworkDetail