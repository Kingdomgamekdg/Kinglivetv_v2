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
import avatar from '../../assets/images/nft-market/avatar.png'
import noData from '../../assets/images/nft-market/no-data.png'
const { Decimal } = require('decimal.js')

const NFTDetail = () => {
    const userRedux = useSelector((state) => state.user)
    const ids = new URLSearchParams(window.location.search).get('ids')
    const index = new URLSearchParams(window.location.search).get('index')
    const history = useHistory()
    if (!ids) history.push('/nft-market')
    const [marketList, setMarketList] = useState([])
    const [currentIndex, setCurrentIndex] = useState(Number(index))
    const [isOpenBuy, setIsOpenBuy] = useState(false)
    const [isApprovedForAll, setIsApprovedForAll] = useState(false)
    const isReviewer = useMemo(() => userRedux?.isReviewer, [userRedux])
    const address = useMemo(() => userRedux?.address, [userRedux])
    const isOwner = useMemo(() => userRedux?.address==marketList[currentIndex]?.user?.address, [marketList,currentIndex])
    const [amountBuy, setAmountBuy] = useState(false)
    const [isApproval, setIsApproval] = useState(false)

    useEffect(() => {
        ;(async () => {
          try {
            const res = await callAPI.get(`market/get-market-by-ids?ids=${ids}`)
            setMarketList(res?.data?res.data:[])
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

    const ContentSwiper = (marketList) => {
        const list=[];
        marketList.map((listingAsset,index)=>{
            const key=`swiper-slide${index}`
            list.push(
                <SwiperSlide key={key}>
                     <div className="item-swiper-content">
                        <img src={listingAsset?.asset?.metadata?.image_preview} alt="" />
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
            >{ContentSwiper(marketList)}
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

      const handleBuy = async (e) => {
        e.preventDefault()
        const listId = e.target._listid.value
        const type = new Number(e.target._type.value)
        const amount = new Decimal(e.target._amount.value).toHex()
        const paymentToken = marketList[currentIndex].payment_token
        const netTotalPayment = new Decimal(e.target._netTotal.value).toHex()
        console.log('netTotalPayment', netTotalPayment)
        if (type == 1) {
          window.contractMarket.methods
            .buy(listId, amount, paymentToken, netTotalPayment)
            .send({ from: window.ethereum.selectedAddress })
            .then((result) => {
              if (result) {
               
              }
            })
        } else {
          const netPaymentPrice = new Decimal(e.target._netPaymentPrice.value).toHex()
          window.contractMarket.methods
            .bid(listId, amount, paymentToken, netPaymentPrice, 100000000)
            .send({ from: window.ethereum.selectedAddress })
            .then((result) => {
              if (result) {

              }
            })
        }
      }
    
      const handleApproval = async () => {
        window.contractERC20.methods
          .approve(addressMarket, '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
          .send({ from: window.ethereum.selectedAddress })
          .then((result) => {
            if (result) {
             
            }
          })
      }
    
      const handleDelist = async () => {
        window.contractMarket.methods
          .cancelListed(marketList[currentIndex].id)
          .send({ from: window.ethereum.selectedAddress })
          .then((result) => {
          })
        }

    return (
            <>
                {isOpenBuy && (
                    <div key={marketList[currentIndex]._id} className='market-popupX' onClick={() => setIsOpenBuy(false)}>
                    
                    <form
                        className='containerX'
                        onSubmit={handleBuy}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/*new element: popup name */}
                        <h1>Checkout</h1>
                        <span className='close_popup'></span>
                        
                        {/* e:new element: content container */}
                        <div className='contents_box'>
                        
                        <div className='form-control'>
                            <img className='preview-image 25mb' src={marketList[currentIndex]?.asset?.metadata?.image} alt='' />
                            
                            {/* e:new element: items_information : contain items information */}
                            <div className="items_information">

                            {/* e:new element: item Name */}
                            <h2>{marketList[currentIndex]?.asset?.metadata?.name}</h2>

                            {/* e:new element: Type */}
                            <p>{marketList[currentIndex]?.type}<br />

                            {/* e:new element: Price */}
                                <strong>
                                {paymentList.map((token) => {
                                    if (token.address === marketList[currentIndex]?.payment_token) {
                                        return (
                                        <div className='price'>
                                            {new Decimal(marketList[currentIndex]?.price?marketList[currentIndex]?.price:0).div(new Decimal(10).pow(token.decimal)) +
                                            ' ' +
                                            token.coin}{' '}
                                        </div>
                                        )
                                    }
                                    return null
                                    })}
                                </strong>{/* ---e:Price--- */}
                            </p>{/* ---e:Type--- */}
                            </div>{/* --------------e:item_information------------------------ */}
                            
                        </div>{/* --------------e:form-control------------------------ */}
                        {/*
                        <div className='form-control'>

                            
                            <div className='label'>NFT</div>

                            <input
                            type='hidden'
                            name='_contract'
                            readOnly
                            value={marketList[currentIndex]?.asset?.collection_id}
                            />
                            <input type='hidden' name='_type' readOnly value={marketList[currentIndex]?.type} />
                            <input type='hidden' name='_id' readOnly value={marketList[currentIndex]?.asset?.id} />
                            <input type='hidden' name='_listid' readOnly value={marketList[currentIndex]?.id} />
                            </div>
                        <div className='form-control'>
                            <div className='label'>Available</div>
                            <input type='number' readOnly value={marketList[currentIndex]?.quantity} name='_quantity' />
                        </div>*/}
                        <div className='form-control'>
                            <div className="flex_column">
                            <label>Quantity</label>
                            <div className="input_boundingbox">
                                
                                <input
                                type='number'
                                id='_amount'
                                name='_amount'
                                min='1'
                                step='1'
                                max={marketList[currentIndex]?.quantity}
                                value={amountBuy}
                                onChange={(e) => {}}
                                />
                                <span className="increment"></span>
                                <span className="decrement"></span>
                                </div>{/* ---e:input_boundingbox---*/}  

                            </div>{/* ---e:flex_column---*/}

                            <div className="flex_column">
                            <label className='label'>Payment Token</label>
                            <div className="box">
                                <select name='_paymentToken'>
                                        {paymentList.map((pm, i) => (
                                        <option value={i}>{pm.coin}</option>
                                        ))}
                                </select>
                            </div>{/* ---e:box---*/}

                            {/*<input type='number' readOnly name='_total' value={total} />
                            <input type='hidden' readOnly name='_netTotal' value={netTotal} />*/}

                            </div>{/* ---e:flex_column---*/}

                            <div className="extra_row">
                            <p>Estimated Amount:
                                <strong>{0} KDG </strong>
                            </p>
                        </div>{/* ---e:extra_row---*/}

                        </div>{/* --------------e:form-control------------------------ */}

                        
                        {/*
                        {marketList[currentIndex]?.type == 1 && (
                        <div className='form-control'>
                            <div className='label'>Price</div>
                            {paymentList.map((token) => {
                            if (token.address === marketList[currentIndex]?.payment_token) {
                                return (
                                <div className='price'>
                                    {new Decimal(marketList[currentIndex].price).div(new Decimal(10).pow(token.decimal)) +
                                    ' ' +
                                    token.coin}{' '}
                                </div>
                                )
                            }
                            return null
                            })}
                        </div>
                        )}{/* --------------e:form-control------------------------ */}
                        {/*
                        {marketList[currentIndex]?.type == 2 && (
                        <div className='form-control'>
                            <div className='label'>Price</div>
                            {paymentList.map((token) => {
                            if (token.address === marketList[currentIndex]?.payment_token) {
                                return (
                                <div className='price'>
                                    <input
                                    type='number'
                                    id='_price'
                                    name='_price'
                                    min={new Decimal(marketList[currentIndex].price)
                                        .div(new Decimal(10).pow(token.decimal))
                                        .toString()}
                                    max={5000000}
                                    value={price}
                                    onChange={(e) => handleChangePriceOrder(e.target.value)}
                                    />
                                    <input
                                    type='hidden'
                                    id='_netPaymentPrice'
                                    name='_netPaymentPrice'
                                    value={netPaymentPrice}
                                    />
                                </div>
                                )
                            }
                            return null
                            })}
                        </div>
                        )}{/* --------------e:form-control------------------------ */}
                        {/*
                        <div className='form-control'>
                        <div className='label'>Total</div>
                        <input type='number' readOnly name='_total' value={total} />
                        <input type='hidden' readOnly name='_netTotal' value={netTotal} />
                        </div>{/* --------------e:form-control------------------------ */}
                        {isOwner && (
                        <button className='buttonX' onClick={() => handleDelist(marketList[currentIndex].id)}>
                            Delisting
                        </button>
                        )}
                        {!isOwner && marketList[currentIndex]?.type == 1 && isApproval && (
                        <button type='submit' className='buttonX'>
                            Buy
                        </button>
                        )}
                        {!isOwner && marketList[currentIndex]?.type == 2 && isApproval && (
                        <button type='submit' className='buttonX'>
                            Bid orders
                        </button>
                        )}
                        {!isOwner && !isApproval && (
                        <div className='form-control submit_box'>
                            <button className='buttonX' onClick={handleApproval}>
                            Comfirm
                            </button>
                            <button className='buttonX--cancel' >
                            cancel
                            </button>             
                        </div>
                        )}{/* ------e:form-control------------- */}
                        {/*
                        {marketList[currentIndex]?.type == 1 && (
                        <>
                            <div className='label'>Transaction history</div>
                            <table className='market-tableX'>
                            <thead>
                                <th>From</th>
                                <th>Amount</th>
                                <th>Payment Amount</th>
                            </thead>
                            {marketList[currentIndex]?.buys.map((b) => (
                                <>
                                <tbody>
                                    <td>
                                    {b?.from?.kyc?.last_name
                                        ? b?.from?.kyc?.last_name + ' ' + b?.from?.kyc?.first_name
                                        : b?.from?.address}
                                    </td>
                                    <td>{b?.quantity}</td>
                                    {paymentList.map((token) => {
                                    if (token.address === marketList[currentIndex]?.payment_token) {
                                        return (
                                        <td>
                                            {new Decimal(b?.payment_amount).div(
                                            new Decimal(10).pow(token.decimal)
                                            ) +
                                            ' ' +
                                            token.coin}{' '}
                                        </td>
                                        )
                                    }
                                    })}
                                </tbody>
                                </>
                            ))}
                            </table>
                        </>
                        )}{/* --------------e:label------------------------ */}
                        
                        {/*marketList[currentIndex]?.type == 2 && (
                        <>{}
                            <div className='label'>Bid orders</div>
                            <table className='market-tableX'>
                            <thead>
                                <th>From</th>
                                <th>Amount</th>
                                <th>Price</th>
                                <th>Action</th>
                            </thead>
                            {marketList[currentIndex]?.bid_orders.map((b) => (
                                <>
                                <tbody>
                                    <td>
                                    {b?.from?.kyc?.last_name
                                        ? b?.from?.kyc?.last_name + ' ' + b?.from?.kyc?.first_name
                                        : b?.from?.address}
                                    </td>
                                    <td>{b?.quantity}</td>
                                    {paymentList.map((token) => {
                                    if (token.address === marketList[currentIndex]?.payment_token) {
                                        return (
                                        <td>
                                            {new Decimal(b?.payment_price).div(
                                            new Decimal(10).pow(token.decimal)
                                            ) +
                                            ' ' +
                                            token.coin}{' '}
                                        </td>
                                        )
                                    }
                                    })}
                                    {isOwner && b?.status == 1 && (
                                    <td>
                                        <button onClick={() => handleAcceptBid(b.id)}>Accept</button>
                                    </td>
                                    )}
                                    {isOwner && b?.status == 2 && (
                                    <td>
                                        <button>Accepted</button>
                                    </td>
                                    )}
                                    {!isOwner && b?.status == 1 && <td></td>}
                                </tbody>
                                </>
                            ))}
                            </table>
                        </>
                        )*/}
                        </div>
                    </form>         
                    </div>
                )}{/* --------------e:market-popupX------------------------ */}
                <div className="main-wrapper">
                    <div className="box-slide-artwork">
                        <div className="box-return" onClick={() => history.push('/my-artwork')}>
                            <img src={arrowLeft} alt="" /> 
                            <span className="text-return">{marketList[currentIndex]?.asset?.metadata?.name}</span>
                        </div>
                       <SwiperComponent/>
                        <div className="box-img" onClick={()=> window.open(marketList[currentIndex]?.asset?.metadata?.image,'_blank')}>
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
                                {marketList[currentIndex]?.asset?.metadata?.name}
                            </h2>
                            <p className="desc-artist">
                                <span className="desc">
                                    {new Decimal(marketList[currentIndex]?.price?marketList[currentIndex]?.price:0).div(new Decimal(10).pow(18)).toString()} KDG
                                </span>
                                {/* <span className="txt">
                                    $1000
                                </span> */}
                                <span className="txt">
                                    {marketList[currentIndex]?.amount} of {marketList[currentIndex]?.asset.total_editions}
                                </span>
                            </p> 
                        </div>
                        <div className="artist-content-body">
                            <div className="desciption-artist">
                                <p className="desc">
                                    Artist: <span className="color-fff"> {marketList[currentIndex]?.user?.kyc?.last_name?marketList[currentIndex]?.user?.kyc?.last_name + ' '+marketList[currentIndex]?.user?.kyc?.first_name:marketList[currentIndex]?.user?.address   } </span>
                                </p>
                                {/* <p className="desc">
                                    Size: <span className="color-fff"> 366x435px </span>
                                </p> */}
                                <p className="desc">
                                    Created: <span className="color-fff"> {new Date(marketList[currentIndex]?.asset?.time*1000).toDateString()}</span>
                                </p>
                                <p className="desc mar-t-10">
                                    Description: 
                                    <span className="color-fff d-block mar-t-10"> 
                                    {marketList[currentIndex]?.asset?.metadata?.description}
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
                                        {marketList[currentIndex]?.asset?.collection_id?.substring(0,5)+ '...' +marketList[currentIndex]?.asset?.collection_id?.substring(marketList[currentIndex]?.asset?.collection_id.length-9,marketList[currentIndex]?.asset?.collection_id.length) } <img src={address} alt="" /> 
                                    </p>
                                </div>
                                <div className="contract-item">
                                    <p className="text-contract">
                                        Token ID:
                                    </p>
                                    <p className="address-contract">
                                    {marketList[currentIndex]?.asset?.id } <img src={address} alt="" /> 
                                    </p>
                                </div>
                                <div className="contract-item">
                                    <p className="text-contract">
                                        Creator's Address:
                                    </p>
                                    <p className="address-contract">
                                        {marketList[currentIndex]?.user?.address.substring(0,5)+ '...' +marketList[currentIndex]?.user?.address.substring(marketList[currentIndex]?.user?.address.length-9,marketList[currentIndex]?.user?.address.length) }  <img src={address} alt="" /> 
                                    </p>
                                </div>
                            </div>
                        </div>
                        {isOwner && isApprovedForAll && marketList[currentIndex]?.asset?.status === 1 && (
                            <div className="artist-content-button">
                            <button type="button" className="btn-sell" onClick={()=> handleDelist()}>
                                Delist
                            </button>
                        </div>
                        )} 

                        {isOwner && !isApprovedForAll && marketList[currentIndex]?.asset?.status === 1 && (
                            <div className="artist-content-button">
                            <button type="button" className="btn-sell" onClick={()=> handleApprove()}>
                                Delist
                            </button>
                        </div>
                        )} 

                
                    </div>
                </div>


                    <div className="box-bidding">
                    <div className="content-bidding">
                        <h2 className="title-bidding">
                            Bidding
                        </h2>
                        <div className="table-bidding">
                            <table>
                                <tr className="tr-1">
                                    <th>
                                        Address
                                    </th>
                                    <th>
                                        Price
                                    </th>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <div className="box-data">
                                            <div className="non-data">
                                                <img src={noData} alt="" />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>


                <div className="box-trading">
                <div className="content-trading">
                    <h2 className="title-trading">
                        Trading History
                    </h2>
                    <div className="table-history">
                        <table>
                            <tr className="tr-1">
                                <th>
                                    From / To
                                </th>
                                <th>
                                    Amount
                                </th>
                                <th>
                                    Price (KDG)
                                </th>
                                <th>
                                    Action
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    <div className="info-user">
                                        <div className="avt">
                                            <img src={avatar} alt="" />
                                        </div>
                                        <div className="info">
                                            <span className="info-name">
                                                Esther Howard
                                            </span>
                                            <span className="info-date">
                                                05/10/2021
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    1
                                </td>
                                <td>
                                    100,000
                                </td>
                                <td>
                                    Donate
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="info-user">
                                        <div className="avt">
                                            <img src={avatar} alt="" />
                                        </div>
                                        <div className="info">
                                            <span className="info-name">
                                                Esther Howard
                                            </span>
                                            <span className="info-date">
                                                05/10/2021
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    1
                                </td>
                                <td>
                                    100,000
                                </td>
                                <td>
                                    Donate
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>

            
                </div>
            </>
    )
}


export default NFTDetail