import { useEffect, useMemo, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import 'swiper/swiper.scss';
import "swiper/components/navigation/navigation.min.css"
import SwiperCore, { Navigation, Lazy, EffectFlip } from 'swiper/core';
import "swiper/components/effect-flip/effect-flip.min.css"
import arrowLeft from '../../assets/images/nft-market/arrow-left.png'
import zoom from '../../assets/images/nft-market/zoom.png'
import '../../assets/scss/my-artwork-detail.scss'
import callAPI from '../../axios'
import { useWeb3React } from '@web3-react/core'
import {  useContractERC20 , useContractMarket} from '../../components/ConnectWalletButton/contract'
import { addressMarket } from '../../contracts/Market'
import noData from '../../assets/images/nft-market/no-data.png'
import avatarDefault from '../../assets/svg/avatarDefault.svg'
import { STORAGE_DOMAIN } from '../../constant'
import {  paymentList } from '../../contracts/ERC20'
import {Decimal} from 'decimal.js'  

const NFTDetail = () => {
    const userRedux = useSelector((state) => state.user)
    const ids = new URLSearchParams(window.location.search).get('ids')
    const index = new URLSearchParams(window.location.search).get('index')
    const history = useHistory()
    if (!ids) history.push('/nft-market')
    const [marketList, setMarketList] = useState([])
    const [currentIndex, setCurrentIndex] = useState(Number(index))
    const [isOpenBuy, setIsOpenBuy] = useState(false)
    const { account } = useWeb3React()
    const contractERC20 = useContractERC20()
    const contractMarket = useContractMarket()

    const address = useMemo(() => userRedux?.address, [userRedux])
    const isOwner = useMemo(() => userRedux?.address === marketList[currentIndex]?.owner?.address, [userRedux,marketList,currentIndex])
    const isApproval = useMemo( async () => {
        if(!account) return
        const allowance = await contractERC20.methods
            .allowance(account, addressMarket)
        if (allowance && marketList[currentIndex]?.price) {
            if (new Decimal(allowance).gt(new Decimal(marketList[currentIndex].price).mul(marketList[currentIndex]?.quantity))) {
            return true
            } else {
            return false
            }
        }
    }, [marketList,currentIndex,account,contractERC20.methods])
   

    const [amountBuy, setAmountBuy] = useState(0)
    const [price, setPrice] = useState(0)

    const total = useMemo(() => {
        if (marketList[currentIndex]?.type === 1 && amountBuy && marketList[currentIndex]?.price) {
            return new Decimal(amountBuy).mul(marketList[currentIndex]?.price).div(new Decimal(10).pow(18)).toNumber()
        }
        if (marketList[currentIndex]?.type === 2 && amountBuy && price) {
            return new Decimal(amountBuy).mul(price).toNumber()
        }
    }, [amountBuy, price , currentIndex ,marketList])

    useEffect(() => {
        ; (async () => {
            try {
                const res = await callAPI.get(`market/get-market-by-ids?ids=${ids}`)
                setMarketList(res?.data ? res.data : [])
            } catch (error) { }
        })()
    }, [ids])

    const reloadList = async (e) => {
        try {
            const res = await callAPI.get(`market/get-market-by-ids?ids=${ids}`)
            setMarketList(res?.data ? res.data : [])
        } catch (error) { }
    }

    SwiperCore.use([Navigation, Lazy, EffectFlip]);

    const ContentSwiper = () => {
        const list = [];
        marketList.forEach((listingAsset, index) => {
            const key = `swiper-slide${index}`
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

    const SwiperComponent = () => {
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
                onSlideChangeTransitionEnd={(swiper) => { setCurrentIndex(swiper.realIndex) }}
            >{ContentSwiper()}
            </Swiper>
        )
        return swiper;
    }



    const handleBuy = async (e) => {
        e.preventDefault()
        if(!account) return
        const listId = e.target._listid.value
        const type = Number(e.target._type.value)
        const amount = new Decimal(e.target._amount.value).toHex()
        const token = paymentList[e.target._paymentToken.value]
        const paymentToken = token.address
        const netTotalPayment = new Decimal(total).mul(new Decimal(10).pow(token.decimal)).toHex()
        if (type ===1) {
          contractMarket.methods
            .buy(listId, amount, paymentToken, netTotalPayment)
            .then((result) => {
              if (result) {
                reloadList()
                setIsOpenBuy(false)
              }
            })
        } else {
          const netPaymentPrice = new Decimal(price).mul(new Decimal(10).pow(token.decimal)).toHex()
          contractMarket.methods
            .bid(listId, amount, paymentToken, netPaymentPrice, 100000000)

            .then((result) => {
                if (result) {

                }
            })
        }
      }
    
      const handleApproval = async () => {
          contractERC20.methods
          .approve(addressMarket, '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
          .then((result) => {
            if (result) {
             
            }
          })
      }

    


    const handleChangeAmount = (event) => {
        let { value, min, max } = event.target;
        value = Math.max(Number(min), Math.min(Number(max), Number(value)));
        setAmountBuy(value)
    }

    const handleChangePrice = (event) => {
        let { value, min, max } = event.target;
        value = Math.max(Number(min), Math.min(Number(max), Number(value)));
        setPrice(value)
    }

    const handleDelist = async () => {
        contractMarket.methods
        .cancelListed(marketList[currentIndex].id)
        .then((result) => {
            reloadList()
            setIsOpenBuy(false)
        })

    }

    const handleAcceptBid = async (bidId) => {
        contractMarket.methods
            .acceptBid(bidId)
            .then((result) => { 
                reloadList()
                setIsOpenBuy(false)
            })
    }
    const handleCancelBid = async (bidId) => {
        contractMarket.methods
            .cancelBid(bidId)
            .then((result) => {
                reloadList()
                setIsOpenBuy(false)
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
                        {marketList[currentIndex]?.type === 1 && (
                            <h1>Checkout</h1>
                        )}
                        {marketList[currentIndex]?.type === 2 && (
                            <h1>Bidding</h1>
                        )}
                        <span className='close_popup' onClick={() => setIsOpenBuy(false)}></span>

                        {/* e:new element: content container */}
                        <div className='contents_box'>

                            <div className='form-control'>
                                <img className='preview-image 25mb' src={marketList[currentIndex]?.asset?.metadata?.image} alt='' />

                                {/* e:new element: items_information : contain items information */}
                                <div className="items_information">

                                    {/* e:new element: item Name */}
                                    <h2>{marketList[currentIndex]?.asset?.metadata?.name}</h2>

                                    {/* e:new element: Type */}
                                    <p>Avaiable {marketList[currentIndex]?.quantity}<br />

                                        {/* e:new element: Price */}
                                        <strong>
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
                                            type='hidden'
                                            id='_listid'
                                            name='_listid'
                                            value={marketList[currentIndex]?.id}
                                        />
                                        <input
                                            type='hidden'
                                            id='_type'
                                            name='_type'
                                            value={marketList[currentIndex]?.type}
                                        />
                                        <input
                                            type='number'
                                            id='_amount'
                                            name='_amount'
                                            min='1'
                                            step='1'
                                            max={marketList[currentIndex]?.quantity}
                                            value={amountBuy}
                                            onChange={(e) => handleChangeAmount(e)}
                                        />
                                        <span className="increment" onClick={() => {
                                            if (amountBuy >= marketList[currentIndex]?.quantity) return
                                            setAmountBuy(amountBuy + 1)
                                        }
                                        }></span>
                                        <span className="decrement" onClick={() => {
                                            if (amountBuy <= 1) return
                                            setAmountBuy(amountBuy - 1)
                                        }
                                        }></span>
                                    </div>{/* ---e:input_boundingbox---*/}

                                </div>{/* ---e:flex_column---*/}
                                {marketList[currentIndex]?.type === 2 && (
                                    <div className="flex_column">
                                        <label className='label'>Price</label>
                                        <div className="input_boundingbox">
                                            <input
                                                type='number'
                                                id='_price'
                                                name='_price'
                                                min={new Decimal(marketList[currentIndex].price).div(new Decimal(10).pow(18)).toNumber()}
                                                max='100000'
                                                readOnly={marketList[currentIndex].type === 1}
                                                value={price}
                                                onChange={(e) => handleChangePrice(e)}
                                            />
                                            <span className="increment" onClick={() => {
                                                if (price >= 100000) return
                                                setPrice(price + 1)
                                            }
                                            }></span>
                                            <span className="decrement" onClick={() => {
                                                if (price <= new Decimal(marketList[currentIndex].price).div(new Decimal(10).pow(18)).toNumber()) return
                                                setPrice(price - 1)
                                            }
                                            }></span>
                                        </div>{/* ---e:input_boundingbox---*/}

                                    </div>
                                )}

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
                                        <strong>{total} KDG </strong>
                                    </p>
                                </div>{/* ---e:extra_row---*/}

                            </div>{/* --------------e:form-control------------------------ */}


                            {/*
                            {marketList[currentIndex]?.type === 1 && (
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

                            {/* --------------e:form-control------------------------
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
                            {!isOwner && marketList[currentIndex]?.type === 1 && isApproval && (
                                <button type='submit' className='buttonX'>
                                    Buy
                                </button>
                            )}
                            {!isOwner && marketList[currentIndex]?.type === 2 && isApproval && (
                                <button type='submit' className='buttonX'>
                                    Bid orders
                                </button>
                            )}

                            {/*
                            {marketList[currentIndex]?.type === 1 && (
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

                            {/*marketList[currentIndex]?.type === 2 && (
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
                                        {isOwner && b?.status === 1 && (
                                        <td>
                                            <button onClick={() => handleAcceptBid(b.id)}>Accept</button>
                                        </td>
                                        )}
                                        {isOwner && b?.status === 2 && (
                                        <td>
                                            <button>Accepted</button>
                                        </td>
                                        )}
                                        {!isOwner && b?.status === 1 && <td></td>}
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
                    <div className="box-return" onClick={() => history.push('/nft-market')}>
                        <img src={arrowLeft} alt="" />
                        <span className="text-return">{marketList[currentIndex]?.asset?.metadata?.name}</span>
                    </div>
                    <SwiperComponent />
                    <div className="box-img" onClick={() => window.open(marketList[currentIndex]?.asset?.metadata?.image, '_blank')}>
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
                                    {new Decimal(marketList[currentIndex]?.price ? marketList[currentIndex]?.price : 0).div(new Decimal(10).pow(18)).toString()} KDG
                                </span>
                                {/* <span className="txt">
                                    $1000
                                </span> */}
                                <span className="txt">
                                    {marketList[currentIndex]?.quantity} of {marketList[currentIndex]?.asset.total_editions}
                                </span>
                            </p>
                        </div>
                        <div className="artist-content-body">
                            <div className="desciption-artist">
                                <p className="desc">
                                    Artist: <span className="color-fff"> {marketList[currentIndex]?.owner?.kyc?.last_name ? marketList[currentIndex]?.owner?.kyc?.last_name + ' ' + marketList[currentIndex]?.owner?.kyc?.first_name : marketList[currentIndex]?.owner?.address} </span>
                                </p>
                                {/* <p className="desc">
                                    Size: <span className="color-fff"> 366x435px </span>
                                </p> */}
                                <p className="desc">
                                    Created: <span className="color-fff"> {new Date(marketList[currentIndex]?.asset?.time).toDateString()}</span>
                                </p>
                                <p className="desc mar-t-10">
                                    Description:
                                    <span className="color-fff d-block mar-t-10">
                                        {marketList[currentIndex]?.asset?.metadata?.description}
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
                                        {marketList[currentIndex]?.asset?.collection_id?.substring(0, 5) + '...' + marketList[currentIndex]?.asset?.collection_id?.substring(marketList[currentIndex]?.asset?.collection_id.length - 9, marketList[currentIndex]?.asset?.collection_id.length)} <img src={address} alt="" />
                                    </p>
                                </div>
                                <div className="contract-item">
                                    <p className="text-contract">
                                        Token ID:
                                    </p>
                                    <p className="address-contract">
                                        {marketList[currentIndex]?.asset?.id} <img src={address} alt="" />
                                    </p>
                                </div>
                                <div className="contract-item">
                                    <p className="text-contract">
                                        Creator's Address:
                                    </p>
                                    <p className="address-contract">
                                        {marketList[currentIndex]?.asset?.owner.address.substring(0, 5) + '...' + marketList[currentIndex]?.asset?.owner?.address.substring(marketList[currentIndex]?.asset?.owner?.address.length - 9, marketList[currentIndex]?.asset?.owner?.address.length)}  <img src={address} alt="" />
                                    </p>
                                </div>
                            </div>
                        </div>
                        {isOwner && isApproval && marketList[currentIndex]?.asset?.status === 1 && (
                            <div className="artist-content-button">
                                <button type="button" className="btn-sell" onClick={() => handleDelist()}>
                                    Delist
                                </button>
                            </div>
                        )}
                        {!isOwner && isApproval && marketList[currentIndex]?.type === 1 && (
                            <div className="artist-content-button">
                                <button type="button" className="btn-sell" onClick={() => {
                                    setIsOpenBuy(true)
                                    setAmountBuy(0)
                                }}>
                                    Buy
                                </button>
                            </div>
                        )}

                        {!isOwner && isApproval && marketList[currentIndex]?.type === 2 && (
                            <div className="artist-content-button">
                                <button type="button" className="btn-sell" onClick={() => {
                                    setIsOpenBuy(true)
                                    setPrice(new Decimal(marketList[currentIndex]?.price).div(new Decimal(10).pow(18)).toNumber())
                                }
                                }>
                                    Bid
                                </button>
                            </div>
                        )}

                        {!isApproval && (
                            <div className="artist-content-button">
                                <button type="button" className="btn-sell" onClick={() => handleApproval()}>
                                    Approval
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
                                <tr className="tr">
                                    <th>
                                        From
                                    </th>
                                    <th>
                                        Amount
                                    </th>
                                    <th>
                                        Price
                                    </th>
                                    <th>
                                        Action
                                    </th>

                                </tr>
                                {marketList[currentIndex]?.bid_orders.map(bid => {
                                    if (bid.status !== 2)
                                        return (
                                            <tr>
                                                <td >
                                                    {bid.from?.kyc?.last_name ? bid.from?.kyc?.last_name + ' ' + bid.from?.kyc?.first_name : bid.from?.address?.substring(bid.from?.address?.length - 8, bid.from?.address?.length)}
                                                </td>
                                                <td>
                                                    {bid.quantity}
                                                </td>
                                                <td>
                                                    {new Decimal(bid.payment_price).div(new Decimal(10).pow(18)).toString()}
                                                </td>
                                                <td>
                                                    {isOwner && bid?.status === 0 && (
                                                        <div onClick={() => handleAcceptBid(bid.id)}>Accept</div>
                                                    )}
                                                    {isOwner && bid?.status === 1 && (
                                                        <div>Accepted</div>
                                                    )}

                                                    {address === bid?.from?.address && bid.status === 0 && (
                                                        <div onClick={() => handleCancelBid(bid.id)}>Cancel</div>
                                                    )}
                                                    {address === bid?.from?.address && bid.status === 2 && (
                                                        <div>Canceled</div>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    else return null
                                })}
                                {!marketList[currentIndex]?.bid_orders?.length && (
                                    <tr>
                                        <td colSpan={4}>
                                            <div className="box-data">
                                                <div className="non-data">
                                                    <img src={noData} alt="" />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
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
                                {marketList[currentIndex]?.buys.map(buy => {
                                    return (
                                        <tr>
                                            <td>
                                                <div className="info-user">
                                                    <div className="avt">
                                                        <img alt="" src={buy.from?.kyc?.avatar?.path ? `${STORAGE_DOMAIN}${buy.from?.kyc?.avatar?.path}` : avatarDefault} />
                                                    </div>
                                                    <div className="info">
                                                        <span className="info-name">
                                                            {buy.from?.kyc?.last_name ? buy.from?.kyc?.last_name + ' ' + buy.from?.kyc?.first_name : '0x.....' + buy.from?.address?.substring(buy.from?.address?.length - 8, buy.from?.address?.length)}
                                                        </span>
                                                        <span className="info-date">
                                                            {new Date(buy?.time).toDateString}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {buy?.quantity}
                                            </td>
                                            <td>
                                                {new Decimal(buy?.payment_amount).div(new Decimal(10).pow(18)).toString()}
                                            </td>
                                            <td>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {!marketList[currentIndex]?.buys?.length && (
                                    <tr>
                                        <td colSpan={4}>
                                            <div className="box-data">
                                                <div className="non-data">
                                                    <img src={noData} alt="" />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}


                            </table>
                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}


export default NFTDetail