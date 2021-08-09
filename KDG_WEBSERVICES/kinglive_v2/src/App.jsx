import { useState } from 'react'
import { Route, Switch } from 'react-router'
import './assets/scss/profile.scss'
import './assets/scss/styles.scss'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Live from './pages/Live'
import MintNFT from './pages/MintNFT'
import MyArtwork from './pages/MyArtwork'
import MyArtworkDetail from './pages/MyArtworkDetail'
import NFT from './pages/NFT'
import Profile from './pages/Profile'
import Setup from './pages/Setup'
import Upload from './pages/Upload'
import User from './pages/User'
import WatchLive from './pages/WatchLive'
import WatchVideo from './pages/WatchVideo'

function App() {
  const [IsOpenSidebar, setIsOpenSidebar] = useState(false)

  return (
    <>
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
