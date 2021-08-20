import { useCallback, useEffect, useMemo, useRef, useState , Component} from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import 'swiper/swiper.scss';
import "swiper/components/navigation/navigation.min.css"
import SwiperCore, {Navigation , Lazy , EffectFlip} from 'swiper/core';
import arrowLeft from '../../assets/images/nft-market/arrow-left.png'
import imgSlide from '../../assets/images/nft-market/img-slide.png'
import zoom from '../../assets/images/nft-market/zoom.png'
import '../../assets/scss/my-artwork-detail.scss'
import address from '../../assets/images/nft-market/Vector.png'
import callAPI from '../../axios'
import { paymentList } from '../../contracts/ERC20'
import { useWeb3React } from '@web3-react/core'
import { useContractKL1155, useContractERC20 , useContractMarket} from '../../components/ConnectWalletButton/contract'
import {addressMarket} from './../../contracts/Market'


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
    const address = useMemo(() => userRedux?.address, [userRedux])  // Hooks em viết sẵn lấy contracts ra xài thui nè
    const { account } = useWeb3React()
    const contractMarket = useContractMarket()
    const contractKL1155 = useContractKL1155()
    const isOwner = useMemo(() => userRedux?.address==userAssetList[currentIndex]?.user?.address, [userAssetList,currentIndex])
    const [priceSell, setPriceSell] = useState(0)
    const [quantitySell, setQuantitySell] = useState(0)
    const { Decimal } = require('decimal.js')

    const totalPayment = useMemo(() => {
        return new Decimal(priceSell).mul(quantitySell).toNumber()
    }, [priceSell,quantitySell])


    useEffect(() => {
        ;(async () => {
          try {
            const res = await callAPI.get(`/user-assets-by-ids?ids=${ids}`)
            setUserAssetList(res?.data?res.data:[])
          } catch (error) {}
        })()
      }, [])



    useEffect(() => {
        ;(async () => {
          if (!account) return
            contractKL1155.methods
            .isApprovedForAll(account, addressMarket)
            .then((approved) => {
              setIsApprovedForAll(approved)
            })
          
        })()
      }, [address])

    


    SwiperCore.use([Navigation , Lazy , EffectFlip]);

    const ContentSwiper = () => {
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
                lazy={true}
                effect={'flip'}
                loop={true}
                mousewheel
                grabCursor={true}
                centeredSlides
                navigation
                spaceBetween={70}
                slidesPerView={1}
                initialSlide={currentIndex}
                // onSlideChange={() => console.log('slide change')}
                onSlideChangeTransitionEnd={(swiper) => {setCurrentIndex(swiper.realIndex)}}
                onSwiper={()=>{}}
            >{ContentSwiper()}
            </Swiper>
        )
        return swiper;
    }

    const handleSell = async (e) => {
        e.preventDefault()
        if(!account) return
        const { Decimal } = require('decimal.js')
        const paymentToken = paymentList[e.target._paymentToken.value]
        const price = new Decimal(e.target._price.value)
          .mul(new Decimal(10).pow(paymentToken.decimal))
          .toHex()
            await contractMarket.methods
            .list(
              e.target._contract.value,
              e.target._id.value,
              new Decimal(e.target._quantity.value).toHex(),
              e.target._mask.value,
              price,
              paymentToken.address,
              100000000
            )
            history.push('/my-artwork')
      }

      const handleApprove = async () => {
        if(!account) return
          const approved = await contractKL1155.methods
            .setApprovalForAll(addressMarket, true)
            .send({ from: window.ethereum.selectedAddress })
          if (approved) {
            setIsApprovedForAll(true)
          }
      }


    
      const handleAccept = async () => {
        if (!account) return
        const result = await contractKL1155.methods
          .reviewAsset(userAssetList[currentIndex].asset.id, true)
        if (result) {
            let newList=[...userAssetList]
            let item = {...newList[currentIndex]};
            item.asset.status = 1
            newList[currentIndex]=item
            setUserAssetList(newList)
        }
      }


      const handleReject = async () => {
        if (!account) return
          const result = await contractKL1155.methods
            .reviewAsset(userAssetList[currentIndex].asset.id, false)
          if (result) {
            let newList=[...userAssetList]
            let item = {...newList[currentIndex]};
            item.asset.status = 2
            newList[currentIndex]=item
            setUserAssetList(newList)
          }
      }

      const handleChangeAmount = (event) => {
        let { value, min, max } = event.target;
        value = Math.max(Number(min), Math.min(Number(max), Number(value)));
        setQuantitySell(value)
        
      };

      const handleChangePrice = (event) => {
        let { value, min, max } = event.target;
        value = Math.max(Number(min), Math.min(Number(max), Number(value)));
        setPriceSell(value)
      };

    return (
            <>
                {isOpenSell && (
                    <div key={userAssetList[currentIndex]?._id} className='popupX' onClick={() => setIsOpenSell(false)}>

                        <form className='containerX' onSubmit={handleSell} onClick={(e) => e.stopPropagation()}>

                            {/*new element: popup name */}
                            <h1>Sell</h1>
                            <span className='close_popup' onClick={()=> setIsOpenSell(false)}></span>
                            {/*---------e:popup name ------------------*/}

                            <div className='contents_box'>
                                <div className='form-control'>
                                    
                                    <img className='preview-image 25mb' src={userAssetList[currentIndex]?.asset?.metadata?.image} alt='' />

                                    {/* e:new element: items_information : contain items information */}
                                    <div className="items_information">
                                        <h2>{userAssetList[currentIndex]?.asset?.metadata?.name}</h2>
                                        <p>{userAssetList[currentIndex]?.asset?.metadata?.mimetype}<br />
                                        </p>{/* ---e:Type--- */}

                                    </div>{/* --e:form-items_information-- */}
                                        
                                        {/*          
                                        <input
                                            type='hidden'
                                            name='_contract'
                                            readOnly
                                            value={userAssetList[currentIndex]?.asset?.collection_id}
                                        />
                                        <input type='hidden' name='_id' readOnly value={userAssetList[currentIndex]?.asset?.id} />*/ }
                                        
                                </div>{/* --------------e:form-control------------------------ */}

                                <div className='form-control bidding'>

                                    <div className="flex_column">
                                        <label>Quantity</label>
                                        <div className="input_boundingbox">
                                            <input type='hidden' id='_contract' name='_contract' value={userAssetList[currentIndex]?.asset?.collection_id}/>
                                            <input type='hidden' id='_id' name='_id' value={userAssetList[currentIndex]?.asset?.id}/>

                                            <input type='number' id='_quantity' min='1' max={userAssetList[currentIndex].amount}  onChange={(e)=> handleChangeAmount(e) } name='_quantity' value={quantitySell}/>
                                            <span className="increment" onClick={()=> {
                                                    if(quantitySell>= userAssetList[currentIndex].amount) return 
                                                    setQuantitySell(quantitySell+1)
                                                }
                                            }></span>
                                            <span className="decrement" onClick={()=>  {
                                                    if(quantitySell <= 1) return 
                                                    setQuantitySell(quantitySell-1)
                                                }}></span>
                                        </div>{/* ---e:input_boundingbox---*/} 
                                    </div>{/* ---e:flex_column--- */}

                                    <div className="flex_column">
                                        <label>Price</label>
                                        <div className="input_boundingbox">
                                            <input type='number' id='_price' name='_price' min='1' max='50000' name='_price' onChange={(e)=> handleChangePrice(e) } value={priceSell} />
                                            <span className="increment" onClick={()=> {
                                                    if(priceSell>= 50000) return 
                                                    setPriceSell(priceSell+1)
                                                }
                                            }></span>
                                            <span className="decrement" onClick={()=> {
                                                    if(priceSell<= 1) return 
                                                    setPriceSell(priceSell-1)
                                                }
                                            }></span>
                                        </div>{/* ---e:input_boundingbox---*/} 
                                    </div>{/* ---e:flex_column--- */}

                                    <div className="flex_column">
                                        <label>Payment Token</label>
                                        <div className="box">
                                            <select name='_paymentToken'>
                                                {paymentList.map((pm, i) => (
                                                <option value={i}>{pm.coin}</option>
                                                ))}
                                            </select>
                                        </div>{/* ---e:box---*/}

                                        

                                    </div>{/* ---e:flex_column--- */}

                                    <div className="flex_column">
                                        <label>Type</label>
                                        <div className="box">
                                            <select name='_mask'>
                                                <option value="1">Sell</option>
                                                <option value="2">Aution</option>
                                            </select>
                                        </div>{/* ---e:box---*/}

                                        

                                    </div>{/* ---e:flex_column--- */}

    

                                    
                                    <div className="extra_row">
                                        <p>Estimated Amount:
                                            <strong>{totalPayment} KDG </strong>
                                        </p>
                                    </div>{/* ---e:extra_row---*/}

                                   
                                </div>{/* --------------e:form-control------------------------ */}


                                <div className='form-control submit_box'>

                                    <button type="submit" className='buttonX'>Comfirm</button>
                                    <button className='buttonX--cancel' onClick={()=> setIsOpenSell(false)}>Cancel </button>   

                                </div>{/* --------------e:form-control------------------------ */}

                            </div>{/* --------------e:content_box------------------------ */}

                            
                            {/*                         
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
                            </button>*/}
                        </form>{/* --------------e:containerX------------------------ */}
                    </div>
                 )}{/* --------------e:popupX------------------------ */}

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
                                    Created: <span className="color-fff"> {new Date(userAssetList[currentIndex]?.asset?.time).toDateString()}</span>
                                </p>
                                <p className="desc mar-t-10">
                                    Description: 
                                    <span className="color-fff d-block mar-t-10"> 
                                    {userAssetList[currentIndex]?.asset?.metadata?.description}
                                    </span>
                                    <span className="color-fff d-block mar-t-10"> 
                                        Channel: KingLive
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
                            <>
                            <div className="artist-content-button">
                            <button type="button" className="btn-accept" onClick={()=> handleAccept()}>
                                Accept
                            </button>
                            </div>
                            <div className="artist-content-button">
                            <button type="button" className="btn-reject" onClick={()=> handleReject()}>
                                Reject
                            </button>
                            </div>
                            </>
                       
                        )} 

                        {isReviewer && !isOwner && userAssetList[currentIndex]?.asset?.status === 2 && (
                            <div className="artist-content-status-reject">
                                Rejected
                            </div>
                        )} 
                        {isReviewer && !isOwner && userAssetList[currentIndex]?.asset?.status === 1 && (
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