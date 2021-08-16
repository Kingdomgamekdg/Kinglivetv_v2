import { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import banner from '../../assets/images/nft-market/banner.jpg'
import '../../assets/scss/nft-market.scss'
import callAPI from '../../axios'
import { ABIERC20, addressERC20, paymentList } from '../../contracts/ERC20'
import { addressMarket } from '../../contracts/Market'

export default function NFT() {
  const history = useHistory()
  const [PopulateList, setPopulateList] = useState([])
  const [top9List, setTop9List] = useState([])
  const [total, setTotal] = useState(0)
  const [itemBuy, setItemBuy] = useState({})
  const [isApproval, setIsApproval] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  const [amountBuy, setAmountBuy] = useState(0)
  const [price, setPrice] = useState(0)

  const [netTotal, setNetTotal] = useState(0)
  const [netPaymentPrice, setNetPaymentPrice] = useState(0)
  const [topRevenue, setRevenue] = useState([])
  const [topQuantity, setTopQuantityList] = useState([])
  const [ActiveTop9, setActiveTop9] = useState(0)
  const [ActiveRanking, setActiveRanking] = useState(0)
  const isLoadMore = useRef(true)
  const isLoadingAPI = useRef(false)
  const [, setIsLoading] = useState(false)
  const { Decimal } = require('decimal.js')
  const [isOpenBuy, setIsOpenBuy] = useState(false)

  const getAssets = useCallback(async () => {
    var ids = PopulateList.map((o) => o._id)

    const res = await callAPI.get(`/market/get-top-populate?limit=9&${ids.length ? `ids=${ids}` : ''}`, true)
    if (res?.data?.length === 0) {
      isLoadMore.current = false
      setPopulateList([...PopulateList])
      return
    }
    setPopulateList([...PopulateList, ...(res?.data ? res.data : [])])
  }, [PopulateList])

  const getTop9 = useCallback(async () => {
    const res = await callAPI.get(`/market/get-top-assets?limit=9`, true)

    if (res?.data?.length === 0) {
      return
    }
    setTop9List([...(res?.data ? res.data : [])])
  }, [])

  useEffect(() => {
    const handleLoad = async () => {
      const totalHeight = document.getElementById('root').clientHeight
      const scrolledHeight = window.scrollY + window.innerHeight
      const restHeight = totalHeight - scrolledHeight
      const isEnd = restHeight <= 500

      if (isEnd && isLoadMore.current && !isLoadingAPI.current) {
        isLoadingAPI.current = true
        setIsLoading(true)
        await getAssets()
        setIsLoading(false)
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
      const res = await callAPI.get(`/market/get-top-assets?limit=9`, true)
      if (res?.data?.length) {
        setTop9List(res.data)
      }
      const res2 = await callAPI.get(`/market/get-top-populate?limit=10`, true)
      if (res2?.data?.length) {
        setPopulateList(res.data)
      }
      const res3 = await callAPI.get(`/top-sellers-quantity?limit=10`, true)
      if (res2?.data?.length) {
        setTopQuantityList(res.data)
      }
      const res4 = await callAPI.get(`/top-sellers-revenue?limit=10`, true)
      if (res2?.data?.length) {
        setRevenue(res.data)
      }
    })()
  }, [])


  const handleBuy = async (e) => {
    e.preventDefault()
    const listId = e.target._listid.value
    const type = new Number(e.target._type.value)
    const amount = new Decimal(e.target._amount.value).toHex()
    const paymentToken = itemBuy.payment_token
    const netTotalPayment = new Decimal(e.target._netTotal.value).toHex()
    console.log('netTotalPayment', netTotalPayment)
    if (type == 1) {
      window.contractMarket.methods
        .buy(listId, amount, paymentToken, netTotalPayment)
        .send({ from: window.ethereum.selectedAddress })
        .then((result) => {
          if (result) {
            top9List.length = 0
            PopulateList.length = 0
            getTop9()
            getAssets()
            setIsOpenBuy(false)
          }
        })
    } else {
      const netPaymentPrice = new Decimal(e.target._netPaymentPrice.value).toHex()
      window.contractMarket.methods
        .bid(listId, amount, paymentToken, netPaymentPrice, 100000000)
        .send({ from: window.ethereum.selectedAddress })
        .then((result) => {
          if (result) {
            top9List.length = 0
            PopulateList.length = 0
            getTop9()
            getAssets()
            setIsOpenBuy(false)
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
          top9List.length = 0
          PopulateList.length = 0
          getTop9()
          getAssets()
          setIsOpenBuy(false)
        }
      })
  }

  const handleDelist = async (item) => {
    window.contractMarket.methods
      .cancelListed(item)
      .send({ from: window.ethereum.selectedAddress })
      .then((result) => {
        top9List.length = 0
        PopulateList.length = 0
        getTop9()
        getAssets()
        setIsOpenBuy(false)
      })
  }

  const handleAcceptBid = async (bidId) => {
    window.contractMarket.methods
      .acceptBid(bidId)
      .send({ from: window.ethereum.selectedAddress })
      .then((result) => {
        top9List.length = 0
        PopulateList.length = 0
        getTop9()
        getAssets()
        setIsOpenBuy(false)
      })
  }

  const handleBidOrders = async (bidId) => {
    window.contractMarket.methods
      .acceptBid(bidId)
      .send({ from: window.ethereum.selectedAddress })
      .then((result) => {
        top9List.length = 0
        PopulateList.length = 0
        getTop9()
        getAssets()
        setIsOpenBuy(false)
      })
  }

  const checkApproval = useCallback(
    async (item) => {
      if (window?.web3?.eth) {
        const allowance = await new window.web3.eth.Contract(ABIERC20, addressERC20).methods
          .allowance(window.ethereum.selectedAddress, addressMarket)
          .call()
        if (allowance && item) {
          if (new Decimal(allowance).gt(new Decimal(item.price).mul(item?.quantity))) {
            setIsApproval(true)
          }
        }
      }
      if (window.ethereum.selectedAddress === item?.owner?.address) {
        setIsOwner(true)
      } else {
        setIsOwner(false)
      }
    },
    [Decimal]
  )

  const handleChangeAmount = async (amount) => {
    const { Decimal } = require('decimal.js')
    if (amount && amount.length && !isNaN(amount)) {
      paymentList.forEach((token) => {
        if (token.address === itemBuy.payment_token) {
          if (new Decimal(amount).gt(itemBuy.quantity)) {
            setAmountBuy(itemBuy.quantity)
            setTotal(
              new Decimal(itemBuy.quantity).mul(
                Decimal(itemBuy.price).div(new Decimal(10).pow(token.decimal))
              )
            )
            setNetTotal(new Decimal(itemBuy.quantity).mul(Decimal(itemBuy.price)))
            return
          } else {
            setAmountBuy(new Decimal(amount))
            setTotal(
              new Decimal(amount).mul(
                Decimal(itemBuy.price).div(new Decimal(10).pow(token.decimal))
              )
            )
            setNetTotal(new Decimal(amount).mul(Decimal(itemBuy.price)))
            return
          }
        }
      })
    } else {
      setTotal(0)
      setAmountBuy(0)
      return
    }
  }

  const handleChangePriceOrder = async (price) => {
    const { Decimal } = require('decimal.js')
    if (price && price.length && !isNaN(price)) {
      paymentList.forEach((token) => {
        if (token.address === itemBuy.payment_token) {
          setPrice(new Decimal(price))
          setTotal(new Decimal(price).mul(Decimal(amountBuy)))
          setNetPaymentPrice(new Decimal(price).mul(new Decimal(10).pow(token.decimal)))
          return
        }
      })
    } else {
      setTotal(0)
      setPrice(0)
      return
    }
  }

  const handleMouseOverNFT = useCallback((e) => {
    let target = e.target
    while (true) {
      const targetClassList = Array.from(target.classList)
      if (targetClassList.includes('mid') || targetClassList.includes('blur')) {
        break
      }
      target = target.parentElement
    }
    target.classList.add('active-video')
    const video = target.querySelector('video')
    if (video) {
      video.play()
    }
  }, [])

  const handleMouseOutNFT = useCallback((e) => {
    let target = e.target
    while (true) {
      const targetClassList = Array.from(target.classList)
      if (targetClassList.includes('mid') || targetClassList.includes('blur')) {
        break
      }
      target = target.parentElement
    }
    target.classList.remove('active-video')
    const video = target.querySelector('video')
    if (video) {
      video.pause()
      video.currentTime = 0
    }
  })

  return (
    <>
      {isOpenBuy && (
        <div key={itemBuy._id} className='market-popupX' onClick={() => setIsOpenBuy(false)}>
          <form
            className='market-containerX'
            onSubmit={handleBuy}
            onClick={(e) => e.stopPropagation()}
          >
            <img className='preview-image 25mb' src={itemBuy?.asset?.metadata?.image} alt='' />
            <div className='form-control'>
              <div className='label'>NFT</div>
              <input type='text' name='_name' readOnly value={itemBuy?.asset?.metadata?.name} />
              <input
                type='hidden'
                name='_contract'
                readOnly
                value={itemBuy?.asset?.collection_id}
              />
              <input type='hidden' name='_type' readOnly value={itemBuy?.type} />
              <input type='hidden' name='_id' readOnly value={itemBuy?.asset?.id} />
              <input type='hidden' name='_listid' readOnly value={itemBuy?.id} />
            </div>
            <div className='form-control'>
              <div className='label'>Available</div>
              <input type='number' readOnly value={itemBuy?.quantity} name='_quantity' />
            </div>
            <div className='form-control'>
              <div className='label'>Amount to buy</div>
              <input
                type='number'
                id='_amount'
                name='_amount'
                min='1'
                max={itemBuy?.quantity}
                value={amountBuy}
                onChange={(e) => handleChangeAmount(e.target.value)}
              />
            </div>

            {itemBuy?.type == 1 && (
              <div className='form-control'>
                <div className='label'>Price</div>
                {paymentList.map((token) => {
                  if (token.address === itemBuy?.payment_token) {
                    return (
                      <div className='price'>
                        {new Decimal(itemBuy.price).div(new Decimal(10).pow(token.decimal)) +
                          ' ' +
                          token.coin}{' '}
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            )}
            {itemBuy?.type == 2 && (
              <div className='form-control'>
                <div className='label'>Price</div>
                {paymentList.map((token) => {
                  if (token.address === itemBuy?.payment_token) {
                    return (
                      <div className='price'>
                        <input
                          type='number'
                          id='_price'
                          name='_price'
                          min={new Decimal(itemBuy.price)
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
            )}
            <div className='form-control'>
              <div className='label'>Total</div>
              <input type='number' readOnly name='_total' value={total} />
              <input type='hidden' readOnly name='_netTotal' value={netTotal} />
            </div>
            {isOwner && (
              <button className='buttonX' onClick={() => handleDelist(itemBuy.id)}>
                Delisting
              </button>
            )}
            {!isOwner && itemBuy?.type == 1 && isApproval && (
              <button type='submit' className='buttonX'>
                Buy
              </button>
            )}
            {!isOwner && itemBuy?.type == 2 && isApproval && (
              <button type='submit' className='buttonX'>
                Bid orders
              </button>
            )}
            {!isOwner && !isApproval && (
              <button className='buttonX' onClick={handleApproval}>
                Approval
              </button>
            )}
            {itemBuy?.type == 1 && (
              <>
                <div className='label'>Transaction history</div>
                <table className='market-tableX'>
                  <thead>
                    <th>From</th>
                    <th>Amount</th>
                    <th>Payment Amount</th>
                  </thead>
                  {itemBuy?.buys.map((b) => (
                    <>
                      <tbody>
                        <td>
                          {b?.from?.kyc?.last_name
                            ? b?.from?.kyc?.last_name + ' ' + b?.from?.kyc?.first_name
                            : b?.from?.address}
                        </td>
                        <td>{b?.quantity}</td>
                        {paymentList.map((token) => {
                          if (token.address === itemBuy?.payment_token) {
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
            )}

            {itemBuy?.type == 2 && (
              <>
                <div className='label'>Bid orders</div>
                <table className='market-tableX'>
                  <thead>
                    <th>From</th>
                    <th>Amount</th>
                    <th>Price</th>
                    <th>Action</th>
                  </thead>
                  {itemBuy?.bid_orders.map((b) => (
                    <>
                      <tbody>
                        <td>
                          {b?.from?.kyc?.last_name
                            ? b?.from?.kyc?.last_name + ' ' + b?.from?.kyc?.first_name
                            : b?.from?.address}
                        </td>
                        <td>{b?.quantity}</td>
                        {paymentList.map((token) => {
                          if (token.address === itemBuy?.payment_token) {
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
            )}
          </form>
        </div>
      )}
      <div className='nft-market'>
        <div className='banner'>
          <img src={banner} alt='' />
        </div>
        <div className='container'>
          <div className='top-9'>
            <p className='sub-title'>Buy, sell, bidding and discover artworks</p>
            <p className='title'>The 1st & the best NFT marketplace</p>
            <div className='create' onClick={() => history.push('/mint-nft')}>
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z'
                  fill='#F52871'
                />
                <path
                  d='M12.1117 7.17602V8.60002H8.92775V11.944H7.43975V8.60002H4.23975V7.17602H7.43975V3.84802H8.92775V7.17602H12.1117Z'
                  fill='#F52871'
                />
              </svg>
              Create New NFT
            </div>
            {top9List.length && (
              <div className='list'>
                <div className='left'>
                  {top9List.map((o, index) => (
                    <span
                      key={index}
                      onClick={() => {
                        setActiveTop9(index)
                      }}
                      className={`item ${ActiveTop9 === index ? 'active' : ''}`}
                    >
                      <img src={o.asset?.metadata?.image} alt='' />
                    </span>
                  ))}
                </div>
                <div
                  className='mid'
                  onMouseOver={handleMouseOverNFT}
                  onMouseOut={handleMouseOutNFT}
                >
                  {top9List[ActiveTop9]?.asset?.metadata?.mimetype.startsWith('image') && (
                    <>
                      <div className='img'>
                        <img
                          key={'image' + top9List[ActiveTop9]?._id}
                          src={top9List[ActiveTop9]?.asset?.metadata?.image}
                          alt=''
                        />
                      </div>
                    </>
                  )}
                  {top9List[ActiveTop9]?.asset?.metadata?.mimetype.startsWith('video/mp4') && (
                    <>
                      <div className='video'>
                        <img
                          key={'image' + top9List[ActiveTop9]?._id}
                          src={top9List[ActiveTop9]?.asset?.metadata?.image}
                          alt=''
                        />
                        <video
                          muted
                          autoPlay
                          key={'video' + top9List[ActiveTop9]?._id}
                          src={top9List[ActiveTop9]?.asset?.metadata?.animation_url}
                          alt=''
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className='right'>
                  <div className='name'>{top9List[ActiveTop9]?.asset?.metadata?.name}</div>
                  {paymentList.map((token) => {
                    if (token.address === top9List[ActiveTop9]?.payment_token) {
                      return (
                        <div className='price'>
                          {new Decimal(top9List[ActiveTop9]?.price).div(
                            new Decimal(10).pow(token.decimal)
                          ) +
                            ' ' +
                            token.coin}{' '}
                        </div>
                      )
                    }
                    return null
                  })}

                  <div className='info'>
                    <div className='row'>
                      {top9List[ActiveTop9]?.owner?.kyc?.last_name && (
                        <span>
                          {'Artist : ' +
                            top9List[ActiveTop9]?.owner?.kyc?.last_name +
                            ' ' +
                            top9List[ActiveTop9]?.owner?.kyc?.first_name}
                        </span>
                      )}
                      {!top9List[ActiveTop9]?.owner?.kyc?.last_name && (
                        <span>
                          {'Artist : 0x..' +
                            top9List[ActiveTop9]?.owner?.address.substring(
                              top9List[ActiveTop9]?.owner?.address.length - 10,
                              top9List[ActiveTop9]?.owner?.address.length
                            )}
                        </span>
                      )}
                    </div>
                    <div className='row'>
                      <span>
                        {' '}
                        {'Created : ' +
                          new Date(top9List[ActiveTop9]?.asset?.time * 1000).toDateString()}{' '}
                      </span>
                    </div>
                    <div className='row'>
                      <span> {'Avaiable : ' + top9List[ActiveTop9]?.quantity} </span>
                    </div>
                  </div>

                  <span
                    className='btn'
                    onClick={async () => {
                      await setItemBuy(top9List[ActiveTop9])
                      await checkApproval(top9List[ActiveTop9])
                      await handleChangeAmount(0)
                      await setIsOpenBuy(true)
                    }}
                  >
                    Buy Now
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className='ranking'>
            <div className='title'>Ranking</div>
            <div className='tabs'>
              <div
                onClick={() => setActiveRanking(0)}
                className={`tab ${ActiveRanking === 0 ? 'active' : ''}`}
              >
                Top Seller (Quatity)
              </div>
              <div
                onClick={() => setActiveRanking(1)}
                className={`tab ${ActiveRanking === 1 ? 'active' : ''}`}
              >
                Top Seller (revenue)
              </div>
            </div>
            <div className='list'>
              <div className={`top-quatity ${ActiveRanking === 0 ? 'show' : ''}`}>
                {topQuantity.map((o, index) => (
                  <div className='item'>
                    <span className='index'>{index + 1}</span>
                    <span className='avatar'>
                      <img src={o.avatar} alt='' />
                    </span>
                    <span className='info'>
                      <span className='name'>{o.name}</span>
                      <span className='quatity'>{o.quatity} Artworks</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className={`top-seller ${ActiveRanking === 1 ? 'show' : ''}`}>
                {topQuantity.map((o, index) => (
                  <div className='item'>
                    <span className='index'>{index + 1}</span>
                    <span className='avatar'>
                      <img src={o.avatar} alt='' />
                    </span>
                    <span className='info'>
                      <span className='name'>{o.name}</span>
                      <span className='quatity'>{o.quatity} Artworks</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='popular-nft'>
            <div className='title'>Popular NFT</div>
            <div className='list'>
              {PopulateList.map((o, index) => (
                <div className='item'>
                  <div key={'avt' + index} className='avatar-container'>
                    <span className='avatar'>
                      <img src={o.owner?.avatar} alt='' />
                    </span>
                  </div>
                  <div key={'nft' + index} className='nft-blur'>
                    <div
                      className='blur'
                      onMouseOver={handleMouseOverNFT}
                      onMouseOut={handleMouseOutNFT}
                    >
                      {o?.asset?.metadata?.mimetype.startsWith('image') && (
                        <>
                          <div className='img'>
                            <img key={'image' + o?._id} src={o.asset?.metadata?.image} alt='' />
                          </div>
                        </>
                      )}
                      {o?.asset?.metadata?.mimetype.startsWith('video/mp4') && (
                        <>
                          <div className='video'>
                            <img key={'image' + o?._id} src={o?.asset?.metadata?.image} alt='' />
                            <video
                              muted
                              autoPlay
                              key={'video' + o?._id}
                              src={o?.asset?.metadata?.animation_url}
                              alt=''
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className='nft'>
                      <img key={'image' + o?._id} src={o.asset?.metadata?.image} alt='' />
                    </div>
                  </div>
                  <span key={'name' + index} className='name'>
                    {o.asset?.metadata?.name}
                  </span>
                  <div key={'price' + index} className='info'>
                    {paymentList.map((token) => {
                      if (token.address === o.payment_token) {
                        return (
                          <span className='price'>
                            {new Decimal(o.price).div(new Decimal(10).pow(token.decimal)) +
                              ' ' +
                              token.coin}{' '}
                          </span>
                        )
                      }
                      return null
                    })}

                    <span key={'amount' + index} className='amount'>
                      Amount: {o.quantity}
                    </span>
                  </div>
                  <div
                    key={'btn' + index}
                    className='btn'
                    onClick={async () => {
                      await setItemBuy(o)
                      await checkApproval(o)
                      await handleChangeAmount(0)
                      await setIsOpenBuy(true)
                    }}
                  >
                    Buy
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
