import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import banner from '../../assets/images/nft-market/banner.jpg'
import '../../assets/scss/nft-market.scss'
import '../../assets/scss/styles.scss'
import callAPI from '../../axios'
import { ABIERC20, addressERC20, paymentList } from '../../contracts/ERC20'
import { addressMarket } from '../../contracts/Market'
import avatarDefault from '../../assets/svg/avatarDefault.svg'
import { STORAGE_DOMAIN } from '../../constant'
import {Decimal} from 'decimal.js'
export default function NFT() {
  const history = useHistory()
  const [PopulateList, setPopulateList] = useState([])
  const [top9List, setTop9List] = useState([])
  const [itemBuy, setItemBuy] = useState({})
  const [isApproval, setIsApproval] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  const [amountBuy, setAmountBuy] = useState(0)
  const [price, setPrice] = useState(0)


  const [topRevenue, setRevenue] = useState([])
  const [topQuantity, setTopQuantity] = useState([])
  const [ActiveTop9, setActiveTop9] = useState(0)
  const [ActiveRanking, setActiveRanking] = useState(0)
  const isLoadMore = useRef(true)
  const isLoadingAPI = useRef(false)
  const [isOpenBuy, setIsOpenBuy] = useState(false)

  const total = useMemo(() => {
    if (itemBuy?.type === 1 && amountBuy && itemBuy?.price) {
      return new Decimal(amountBuy).mul(itemBuy?.price).div(new Decimal(10).pow(18)).toNumber()
    }
    if (itemBuy?.type === 2 && amountBuy && price) {
      return new Decimal(amountBuy).mul(price).toNumber()
    }
  }, [amountBuy, itemBuy, price])



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
    ; (async () => {
      const res = await callAPI.get(`/market/get-top-assets?limit=9`, true)
      if (res?.data?.length) {
        setTop9List(res.data)
      }
      const res2 = await callAPI.get(`/market/get-top-populate?limit=10`, true)
      if (res2?.data?.length) {
        setPopulateList(res2.data)
      }
      const res3 = await callAPI.get(`/top-sellers-quantity?limit=6`, true)
      if (res3?.data?.length) {
        setTopQuantity(res3.data)
      }
      const res4 = await callAPI.get(`/top-sellers-revenue?limit=6`, true)
      if (res4?.data?.length) {
        setRevenue(res4.data)
      }
    })()
  }, [])


  const handleBuy = async (e) => {
    e.preventDefault()
    const listId = e.target._listid.value
    const type = Number(e.target._type.value)
    const amount = new Decimal(e.target._amount.value).toHex()
    const token = paymentList[e.target._paymentToken.value]
    const paymentToken = token.address
    const netTotalPayment = new Decimal(total).mul(new Decimal(10).pow(token.decimal)).toHex()
    if (type === 1) {
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
      const netPaymentPrice = new Decimal(price).mul(new Decimal(10).pow(token.decimal)).toHex()
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
    []
  )
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



  const handleShowDetailTop9 = async () => {
    var ids = top9List.map((o) => o?._id)
    history.push(`/nft-detail?ids=${ids}&index=${ActiveTop9}`)
  }
  const handleShowDetailPopulate = async (index) => {
    var ids = PopulateList.map((o) => o?._id)
    history.push(`/nft-detail?ids=${ids}&index=${index}`)
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
  },[]);




  return (
    <>
      {isOpenBuy && (
        <div key={itemBuy._id} className='market-popupX' onClick={() => setIsOpenBuy(false)}>

          <form
            className='containerX'
            onSubmit={handleBuy}
            onClick={(e) => e.stopPropagation()}
          >
            {/*new element: popup name */}
            {itemBuy?.type === 1 && (
              <h1>Checkout</h1>
            )}
            {itemBuy?.type === 2 && (
              <h1>Bidding</h1>
            )}
            <span className='close_popup' onClick={() => setIsOpenBuy(false)}></span>

            {/* e:new element: content container */}
            <div className='contents_box'>

              <div className='form-control'>
                <img className='preview-image 25mb' src={itemBuy?.asset?.metadata?.image} alt='' />

                {/* e:new element: items_information : contain items information */}
                <div className="items_information">

                  {/* e:new element: item Name */}
                  <h2>{itemBuy?.asset?.metadata?.name}</h2>

                  {/* e:new element: Type */}
                  <p>Avaiable {itemBuy?.quantity}<br />

                    {/* e:new element: Price */}
                    <strong>
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
                  value={itemBuy?.asset?.collection_id}
                />
                <input type='hidden' name='_type' readOnly value={itemBuy?.type} />
                <input type='hidden' name='_id' readOnly value={itemBuy?.asset?.id} />
                <input type='hidden' name='_listid' readOnly value={itemBuy?.id} />
                </div>
              <div className='form-control'>
                <div className='label'>Available</div>
                <input type='number' readOnly value={itemBuy?.quantity} name='_quantity' />
              </div>*/}
              <div className='form-control'>
                <div className="flex_column">
                  <label>Quantity</label>
                  <div className="input_boundingbox">
                    <input
                      type='hidden'
                      id='_listid'
                      name='_listid'
                      value={itemBuy?.id}
                    />
                    <input
                      type='hidden'
                      id='_type'
                      name='_type'
                      value={itemBuy?.type}
                    />
                    <input
                      type='number'
                      id='_amount'
                      name='_amount'
                      min='1'
                      step='1'
                      max={itemBuy?.quantity}
                      value={amountBuy}
                      onChange={(e) => handleChangeAmount(e)}
                    />
                    <span className="increment" onClick={() => {
                      if (amountBuy >= itemBuy?.quantity) return
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
                {itemBuy?.type === 2 && (
                  <div className="flex_column">
                    <label className='label'>Price</label>
                    <div className="input_boundingbox">
                      <input
                        type='number'
                        id='_price'
                        name='_price'
                        min={new Decimal(itemBuy.price).div(new Decimal(10).pow(18)).toNumber()}
                        max='100000'
                        readOnly={itemBuy.type === 1}
                        value={price}
                        onChange={(e) => handleChangePrice(e)}
                      />
                      <span className="increment" onClick={() => {
                        if (price >= 100000) return
                        setPrice(price + 1)
                      }
                      }></span>
                      <span className="decrement" onClick={() => {
                        if (price <= new Decimal(itemBuy.price).div(new Decimal(10).pow(18)).toNumber()) return
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
            {itemBuy?.type === 1 && (
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
            )}{/* --------------e:form-control------------------------ */}

              {/* --------------e:form-control------------------------
            {/*
            <div className='form-control'>
              <div className='label'>Total</div>
              <input type='number' readOnly name='_total' value={total} />
              <input type='hidden' readOnly name='_netTotal' value={netTotal} />
            </div>{/* --------------e:form-control------------------------ */}
              {isOwner && (
                <button className='buttonX' onClick={() => handleDelist(itemBuy.id)}>
                  Delisting
                </button>
              )}
              {!isOwner && itemBuy?.type === 1 && isApproval && (
                <button type='submit' className='buttonX'>
                  Buy
                </button>
              )}
              {!isOwner && itemBuy?.type === 2 && isApproval && (
                <button type='submit' className='buttonX'>
                  Bid orders
                </button>
              )}
              {!isOwner && !isApproval && (
                <div className='form-control submit_box'>
                  <button className='buttonX' onClick={handleApproval}>
                    Approval
                  </button>
                  <button className='buttonX--cancel' onClick={() => setIsOpenBuy(false)}>
                    Cancel
                  </button>
                </div>
              )}{/* ------e:form-control------------- */}
              {/*
            {itemBuy?.type === 1 && (
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
            )}{/* --------------e:label------------------------ */}

              {/*itemBuy?.type === 2 && (
              <>{}
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
                        new Date(top9List[ActiveTop9]?.asset?.time).toDateString()}{' '}
                    </span>
                  </div>

                  <div className='row'>
                    <span> {'Avaiable : ' + top9List[ActiveTop9]?.quantity} </span>
                  </div>

                  <span className="open_detail_btn" onClick={() => handleShowDetailTop9()}>{`Detail >>`}</span>
                </div>

                <span
                  className='btn'
                  onClick={async () => {
                    await setItemBuy(top9List[ActiveTop9])
                    await checkApproval(top9List[ActiveTop9])
                    await setIsOpenBuy(true)
                    await setAmountBuy(0)
                    setPrice(new Decimal(top9List[ActiveTop9]?.price).div(new Decimal(10).pow(18)).toNumber())
                  }}
                >
                  Buy Now
                </span>
              </div>
            </div>
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
                      <img alt="" src={o.user?.kyc?.avatar?.path ? `${STORAGE_DOMAIN}${o.user?.kyc?.avatar?.path}` : avatarDefault} />
                    </span>
                    <span className='info'>
                      <span className='name'>{o.user?.kyc?.last_name ? o.user?.kyc?.last_name + ' ' + o.user?.kyc?.first_name : '0x....' + o.user?.address.substring(o.user?.address.length - 8, o.user?.address.length)}</span>
                      <span className='quatity'>{o.quantity} Artworks</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className={`top-seller ${ActiveRanking === 1 ? 'show' : ''}`}>
                {topRevenue.map((o, index) => (
                  <div className='item'>
                    <span className='index'>{index + 1}</span>
                    <span className='avatar'>
                      <img alt="" src={o.user?.kyc?.avatar?.path ? `${STORAGE_DOMAIN}${o.user?.kyc?.avatar?.path}` : avatarDefault} />
                    </span>
                    <span className='info'>
                      <span className='name'>{o.user?.kyc?.last_name ? o.user?.kyc?.last_name + ' ' + o.user?.kyc?.first_name : ''}</span>
                      <span className='quatity'>{new Decimal(o?.payment_amount).div(new Decimal(10).pow(18)).toString()} KGD</span>
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
                      <img alt="" src={o.owner?.kyc?.avatar?.path ? `${STORAGE_DOMAIN}${o.owner?.kyc?.avatar?.path}` : avatarDefault} />
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
                    onClick={() => handleShowDetailPopulate(index)}
                  >
                    Detail
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
