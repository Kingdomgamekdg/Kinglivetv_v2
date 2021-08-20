import { useCallback, useEffect, useState } from 'react'
import { Route, Switch } from 'react-router'
import 'react-toastify/dist/ReactToastify.css';
import './assets/scss/profile.scss'
import './assets/scss/styles.scss'
import { toast, ToastContainer } from 'react-toastify';
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Live from './pages/Live'
import MintNFT from './pages/MintNFT'
import MyArtwork from './pages/MyArtwork'
import MyArtworkDetail from './pages/MyArtworkDetail'
import NFTDetail from './pages/NFTDetail'

import NFT from './pages/NFT'
import Profile from './pages/Profile'
import Setup from './pages/Setup'
import Upload from './pages/Upload'
import User from './pages/User'
import WatchLive from './pages/WatchLive'
import WatchVideo from './pages/WatchVideo'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { actChangeUnreadNoti, asyncGetNoti } from './store/actions'
import socket from './socket'
import { useHistory } from 'react-router-dom';

function App() {
  const history = useHistory
  const dispatch = useDispatch()
  const [IsOpenSidebar, setIsOpenSidebar] = useState(false)

  useEffect(() => {
    window.addEventListener('click', () =>
      document
        .querySelectorAll('.profile😢__video .menu')
        .forEach((menu) => menu.classList.remove('show'))
    )
  }, [])

  useMemo(() => {
    dispatch(asyncGetNoti())
  },[dispatch])

  const handleClickNoti = useCallback(
    ({ type, data }) => {
      if (type === 101) history.push(`/profile?uid=${data.user}`);
      if (type === 102 || type === 103 || type === 104) history.push(`/watch?v=${data.video}`);
      if (type === 105) history.push(`/live?s=${data.video}`);
    },
    [history]
  );

  const handleType = useCallback((noti) => {
    console.log(noti);
    return noti.type === 101 ? 
      <p>{noti.data.name} is follow you</p>
      :
      noti.type === 102 ?
      <p>{noti.data.name} is comment on your video</p>
      : 
      noti.type === 103 ? 
      <p>Your video {noti.data.video_name} upload success</p>
      : 
      noti.type === 104 ? 
      <p>{noti.data.name} upload new video {noti.data.video_name}</p>
      : 
      noti.type === 105 ? 
      <p>{noti.data.name} is streaming</p>
      : null

    
  },[])

  useEffect(() => {
    socket.on('noti' , ({data , unread}) => {
      console.log(data);
      dispatch(actChangeUnreadNoti(unread))
      toast(
        <div onClick={() => handleClickNoti(data)}>
          {handleType(data)}
        </div>
      );
    })
  } , [])

  return (
    <>
      <ToastContainer />
      <Header IsOpenSidebar={IsOpenSidebar} toggleSidebar={() => setIsOpenSidebar((x) => !x)} />
      <Sidebar IsOpenSidebar={IsOpenSidebar} />

      <main className={`${IsOpenSidebar ? 'small' : ''}`}>
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/live' component={Live} exact />
          <Route path='/nft-market' component={NFT} exact />
          <Route path='/my-artwork' component={MyArtwork} exact />
          <Route path='/my-artwork-detail' component={MyArtworkDetail} exact />
          <Route path='/mint-nft' component={MintNFT} exact />
          <Route path='/nft-detail' component={NFTDetail} exact />
          <Route path='/upload' component={Upload} exact />
          <Route path='/setup' component={Setup} exact />
          <Route path='/profile' component={Profile} exact />
          <Route path='/user' component={User} exact />
          <Route path='/watchlive' component={WatchLive} exact />
          <Route path='/watchvideo' component={WatchVideo} exact />
        </Switch>
      </main>
    </>
  )
}

export default App
