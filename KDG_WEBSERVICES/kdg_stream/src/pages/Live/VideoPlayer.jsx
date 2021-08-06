import { useCallback, useEffect, useRef, useState } from 'react';
import ReactHlsPlayer from 'react-hls-player';
import * as AiIcon from 'react-icons/ai';
import * as BsIcon from 'react-icons/bs';
import * as FaIcon from 'react-icons/fa';
import * as HiIcon from 'react-icons/hi';
import * as MdIcon from 'react-icons/md';
import * as RiIcon from 'react-icons/ri';
import { useSelector } from 'react-redux';
import pause from '../../assets/images/banner/pause.jpg';
import { Avatar } from '../../components';
import { PLAY_STREAM, STORAGE_DOMAIN } from '../../constant';
import { useLanguage } from '../../context/LanguageLayer';
import { convertTime } from '../../helpers';

export default function VideoPlayer({
  Stream,
  Chat,
  handleChat,
  ListGift,
  setListGift,
  setIsHideChat,
  chatRef,
  IsCanPlay,
}) {
  const [{ language, live }] = useLanguage();
  const user = useSelector(state => state.user);

  const videoRef = useRef();
  const controlsRef = useRef();
  const animationRef = useRef();
  const currentVolumeRef = useRef(1);
  const chatFullscreenRef = useRef();
  const isShowGift = useRef(false);

  const [isMouseDownPlayback, setIsMouseDownPlayback] = useState(false);
  const [isMouseDownVolume, setIsMouseDownVolume] = useState(false);

  const [isPlay, setIsPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [currentVolume, setCurrentVolume] = useState(1);
  const [playbackPercent, setPlaybackPercent] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isHideFullscreenChat, setIsHideFullscreenChat] = useState(false);

  const [CurrentGift, setCurrentGift] = useState(null);

  const handleAdjustPlaybackMouseMove = useCallback(e => {
    const video = videoRef.current;

    !video.paused && video.pause();

    const { width, left } = document
      .querySelector('.live__videoCtn-controls-bottom-playbackBar')
      .getBoundingClientRect();

    let playback_percent = (e.clientX - left) / width;

    if (playback_percent <= 0) playback_percent = 0;
    if (playback_percent >= 1) playback_percent = 1;

    setPlaybackPercent(playback_percent);

    let timeSecond = video.duration * playback_percent;
    setCurrentTime(convertTime(timeSecond));
    video.currentTime = timeSecond;
  }, []);

  const handleAdjustPlaybackMouseDown = useCallback(e => {
    const video = videoRef.current;

    const { width, left } = document
      .querySelector('.live__videoCtn-controls-bottom-playbackBar')
      .getBoundingClientRect();

    let playback_percent = (e.clientX - left) / width;

    if (playback_percent <= 0) playback_percent = 0;
    if (playback_percent >= 1) playback_percent = 1;

    setPlaybackPercent(playback_percent);

    let timeSecond = video.duration * playback_percent;
    setCurrentTime(convertTime(timeSecond));
    video.currentTime = timeSecond;
  }, []);

  const handleAdjustVolume = useCallback(e => {
    const { width, left } = document
      .querySelector('.live__videoCtn-controls-bottom-volumeBar')
      .getBoundingClientRect();

    let volume = (e.clientX - left) / width;

    if (volume <= 0) volume = 0;
    if (volume >= 1) volume = 1;

    setCurrentVolume(volume);
  }, []);

  const handleAdjustPlaybackMouseUp = useCallback(() => {
    const video = videoRef.current;

    video.paused && isPlay && video.play();

    setIsMouseDownPlayback(false);
  }, [isPlay]);

  const handleMuteVideo = useCallback(() => {
    if (!videoRef.current) return;

    if (currentVolume === 0) {
      setCurrentVolume(currentVolumeRef.current);

      animationRef.current && animationRef.current.classList.add('volume');
      setTimeout(() => {
        animationRef.current && animationRef.current.classList.remove('volume');
      }, 600);
    } else {
      currentVolumeRef.current = currentVolume;
      setCurrentVolume(0);

      animationRef.current && animationRef.current.classList.add('mute');
      setTimeout(() => {
        animationRef.current && animationRef.current.classList.remove('mute');
      }, 600);
    }
  }, [currentVolume]);

  const handleToggleFullscreen = useCallback(() => {
    (async function asyncToggleFullScreen() {
      if (!document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
        } catch (error) {
          console.error(error);
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    })();

    setIsFullScreen(x => !x);
  }, []);

  useEffect(() => {
    window.onmouseup = () => {
      isMouseDownVolume && setIsMouseDownVolume(false);
      isMouseDownPlayback && handleAdjustPlaybackMouseUp();
    };

    return () => (window.onmouseup = null);
  }, [isMouseDownVolume, isMouseDownPlayback, handleAdjustPlaybackMouseUp]);

  useEffect(() => {
    let id;

    window.onmousemove = e => {
      isMouseDownVolume && handleAdjustVolume(e);
      isMouseDownPlayback && handleAdjustPlaybackMouseMove(e);

      if (id) clearTimeout(id);

      controlsRef.current && controlsRef.current.classList.remove('notshow');

      id = setTimeout(() => {
        controlsRef.current && controlsRef.current.classList.add('notshow');
      }, 3000);
    };

    return () => {
      if (id) clearTimeout(id);
      window.onmousemove = null;
    };
  }, [isMouseDownVolume, handleAdjustVolume, isMouseDownPlayback, handleAdjustPlaybackMouseMove]);

  useEffect(() => {
    const id = setInterval(() => {
      const video = videoRef.current;

      if (video) {
        let playback_percent = video.currentTime / video.duration;
        if (playback_percent <= 0) playback_percent = 0;
        if (playback_percent >= 1) playback_percent = 1;
        if (playback_percent === 1) video.paused && setIsPlay(false);
        setPlaybackPercent(playback_percent);
        setCurrentTime(convertTime(video.currentTime));
      }
    }, 1000);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const htmlEle = document.querySelector('html');

    if (isFullScreen) {
      htmlEle.classList.add('hidden-scrollbar');
    } else {
      htmlEle.classList.remove('hidden-scrollbar');
    }
  }, [isFullScreen]);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isPlay) {
      videoRef.current.play();

      animationRef.current && animationRef.current.classList.add('play');
      setTimeout(() => {
        animationRef.current && animationRef.current.classList.remove('play');
      }, 600);
    } else {
      videoRef.current.pause();

      animationRef.current && animationRef.current.classList.add('pause');
      setTimeout(() => {
        animationRef.current && animationRef.current.classList.remove('pause');
      }, 600);
    }
  }, [isPlay]);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.volume = currentVolume;
  }, [currentVolume]);

  useEffect(() => {
    const playVideoByKeyboard = e => {
      // console.log(e);

      if (document.activeElement !== document.body) {
        // Blur When Not Focus Body
        if (e.code === 'Escape') {
          document.activeElement.blur();
        }
        // Blur When Not Focus Body

        // Blur When Focus Input Chat Fullscreen
        if (e.code === 'KeyB' && e.ctrlKey && !e.altKey) {
          document.activeElement.blur();
        }
        // Blur When Focus Input Chat Fullscreen
      }

      if (document.activeElement === document.body) {
        // Focus Input Chat When Fullscreen
        if (e.code === 'KeyC' && isFullScreen && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          chatFullscreenRef.current.focus();
          setIsHideFullscreenChat(false);
        }
        // Focus Input Chat When Fullscreen

        // Focus Input Chat When Not Fullscreen
        if (e.code === 'KeyC' && !isFullScreen && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          setIsHideChat(false);
          chatRef.current.focus();
          window.scroll({ top: 0 });
        }
        // Focus Input Chat When Not Fullscreen

        // Hide Chat When Fullscreen
        if (e.code === 'KeyH' && isFullScreen && !e.ctrlKey && !e.altKey) {
          setIsHideFullscreenChat(x => !x);
        }
        // Hide Chat When Fullscreen

        // Hide Chat When Not Fullscreen
        if (e.code === 'KeyH' && !isFullScreen && !e.ctrlKey && !e.altKey) {
          setIsHideChat(x => !x);
        }
        // Hide Chat When Not Fullscreen

        // Play/Pause Video
        if (e.code === 'Space' && !e.ctrlKey && !e.altKey) {
          e.preventDefault();

          setIsPlay(x => !x);
          window.scroll({ top: 0 });
        }

        if (e.code === 'KeyK' && !e.ctrlKey && !e.altKey) {
          setIsPlay(x => !x);
          window.scroll({ top: 0 });
        }
        // Play/Pause Video

        // Toggle Mute Video
        if (e.code === 'KeyM' && !e.ctrlKey && !e.altKey) {
          handleMuteVideo();
        }
        // Toggle Mute Video

        // Toggle Fullscreen Video
        if (e.code === 'KeyF' && !e.ctrlKey && !e.altKey) {
          handleToggleFullscreen();
        }
        // Toggle Fullscreen Video

        // Forward 5s Video
        if (e.code === 'ArrowRight' && !e.ctrlKey && !e.altKey) {
          if (!videoRef.current) return;
          const video = videoRef.current;

          if (video.currentTime / video.duration >= 1) return;
          video.currentTime = video.currentTime + 5;

          animationRef.current && animationRef.current.classList.add('forward5');
          setTimeout(() => {
            animationRef.current && animationRef.current.classList.remove('forward5');
          }, 600);
        }
        // Forward 5s Video

        // Previous 5s Video
        if (e.code === 'ArrowLeft' && !e.ctrlKey && !e.altKey) {
          if (!videoRef.current) return;
          const video = videoRef.current;

          if (video.currentTime / video.duration === 0) return;
          video.currentTime = video.currentTime - 5;

          animationRef.current && animationRef.current.classList.add('replay5');
          setTimeout(() => {
            animationRef.current && animationRef.current.classList.remove('replay5');
          }, 600);
        }
        // Previous 5s Video

        // Forward 10s Video
        if (e.code === 'KeyL' && !e.ctrlKey && !e.altKey) {
          if (!videoRef.current) return;
          const video = videoRef.current;

          if (video.currentTime / video.duration === 1) return;
          video.currentTime = video.currentTime + 10;

          animationRef.current && animationRef.current.classList.add('forward10');
          setTimeout(() => {
            animationRef.current && animationRef.current.classList.remove('forward10');
          }, 600);
        }
        // Forward 10s Video

        // Previous 10s Video
        if (e.code === 'KeyJ' && !e.ctrlKey && !e.altKey) {
          if (!videoRef.current) return;
          const video = videoRef.current;

          if (video.currentTime / video.duration === 0) return;
          video.currentTime = video.currentTime - 10;

          animationRef.current && animationRef.current.classList.add('replay10');
          setTimeout(() => {
            animationRef.current && animationRef.current.classList.remove('replay10');
          }, 600);
        }
        // Previous 10s Video

        // Skip to 0% Video
        if ((e.code === 'Numpad0' || e.code === 'Digit0') && !e.ctrlKey && !e.altKey) {
          const video = videoRef.current;
          video.currentTime = 0;
        }
        // Skip to 0% Video

        // Skip to 10% Video
        if ((e.code === 'Numpad1' || e.code === 'Digit1') && !e.ctrlKey && !e.altKey) {
          const video = videoRef.current;
          video.currentTime = 0.1 * video.duration;
        }
        // Skip to 10% Video

        // Skip to 20% Video
        if ((e.code === 'Numpad2' || e.code === 'Digit2') && !e.ctrlKey && !e.altKey) {
          const video = videoRef.current;
          video.currentTime = 0.2 * video.duration;
        }
        // Skip to 20% Video

        // Skip to 30% Video
        if ((e.code === 'Numpad3' || e.code === 'Digit3') && !e.ctrlKey && !e.altKey) {
          const video = videoRef.current;
          video.currentTime = 0.3 * video.duration;
        }
        // Skip to 30% Video

        // Skip to 40% Video
        if ((e.code === 'Numpad4' || e.code === 'Digit4') && !e.ctrlKey && !e.altKey) {
          const video = videoRef.current;
          video.currentTime = 0.4 * video.duration;
        }
        // Skip to 40% Video

        // Skip to 50% Video
        if ((e.code === 'Numpad5' || e.code === 'Digit5') && !e.ctrlKey && !e.altKey) {
          const video = videoRef.current;
          video.currentTime = 0.5 * video.duration;
        }
        // Skip to 50% Video

        // Skip to 60% Video
        if ((e.code === 'Numpad6' || e.code === 'Digit6') && !e.ctrlKey && !e.altKey) {
          const video = videoRef.current;
          video.currentTime = 0.6 * video.duration;
        }
        // Skip to 60% Video

        // Skip to 70% Video
        if ((e.code === 'Numpad7' || e.code === 'Digit7') && !e.ctrlKey && !e.altKey) {
          const video = videoRef.current;
          video.currentTime = 0.7 * video.duration;
        }
        // Skip to 70% Video

        // Skip to 80% Video
        if ((e.code === 'Numpad8' || e.code === 'Digit8') && !e.ctrlKey && !e.altKey) {
          const video = videoRef.current;
          video.currentTime = 0.8 * video.duration;
        }
        // Skip to 80% Video

        // Skip to 90% Video
        if ((e.code === 'Numpad9' || e.code === 'Digit9') && !e.ctrlKey && !e.altKey) {
          const video = videoRef.current;
          video.currentTime = 0.9 * video.duration;
        }
        // Skip to 90% Video
      }
    };

    window.addEventListener('keydown', playVideoByKeyboard);
    return () => window.removeEventListener('keydown', playVideoByKeyboard);
  }, [isFullScreen, handleMuteVideo, handleToggleFullscreen, chatRef, setIsHideChat]);

  useEffect(() => {
    document.onfullscreenchange = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
      }
    };
    return () => (document.onfullscreenchange = null);
  }, []);

  useEffect(() => {
    if (ListGift.length === 0 || isShowGift.current) return;
    isShowGift.current = true;
    const currentGift = ListGift[0];
    ListGift.splice(0, 1);
    setListGift([...ListGift]);
    setCurrentGift({
      ...currentGift,
      img: currentGift.img + `?${Date.now()}`,
    });
    setTimeout(() => {
      isShowGift.current = false;
      setCurrentGift(null);
    }, currentGift.duration + 300);
  }, [ListGift, CurrentGift, setListGift]);

  useEffect(() => {}, [Stream.status]);

  return (
    <>
      <div
        style={{
          '--z-index-fullscreen': isFullScreen ? 30000 : 20000,
          '--z-index-controls': isFullScreen ? 30001 : 20001,
          '--z-index-chat': isFullScreen ? 30002 : 20002,
        }}
        className={`live__videoCtn ${isFullScreen ? 'fullscreen' : ''}`}
      >
        <div className={`live__videoCtn-gift ${CurrentGift ? 'show' : ''}`}>
          <span>
            {live[language].sendgift
              .replace('user_name', CurrentGift?.user_name)
              .replace('gift_name', CurrentGift?.gift_name)}
          </span>
          <img src={CurrentGift?.img} alt='' />
        </div>

        {isFullScreen && (
          <div className={`live__chatfullscreen ${isHideFullscreenChat ? 'hide' : ''}`}>
            <div
              className='live__chatfullscreen-arrowBtn'
              onClick={() => setIsHideFullscreenChat(x => !x)}
            >
              <MdIcon.MdKeyboardArrowRight className='icon' />
            </div>

            <div className='live__chatfullscreen-top'>
              {Chat.map((o, i) => (
                <div className='live__chatfullscreen-top-ctn' key={i}>
                  <div className='live__chatfullscreen-top-ctn-avatar'>
                    <Avatar
                      src={
                        o.user?.kyc.avatar?.path
                          ? STORAGE_DOMAIN + o.user?.kyc.avatar?.path
                          : undefined
                      }
                      position={o.user?.kyc.avatar_pos}
                    />
                  </div>

                  <div>
                    <div className='live__chatfullscreen-top-ctn-name'>
                      {o.user?.kyc.first_name} {o.user?.kyc.last_name}
                      {':'}
                    </div>
                    <div className='live__chatfullscreen-top-ctn-text'>{o.chat}</div>
                  </div>
                </div>
              ))}
            </div>

            {user && (
              <div className='live__chatfullscreen-bottom'>
                <div className='live__chatfullscreen-bottom-chat'>
                  <div className='live__chatfullscreen-bottom-chat-avatar'>
                    <Avatar
                      src={
                        user?.kyc.avatar?.path ? STORAGE_DOMAIN + user?.kyc.avatar?.path : undefined
                      }
                      position={user?.kyc.avatar_pos}
                    />
                  </div>

                  <form onSubmit={handleChat} className='live__chatfullscreen-bottom-chat-inputBox'>
                    <input
                      ref={chatFullscreenRef}
                      name='chat'
                      type='text'
                      placeholder={live[language].chathere}
                    />

                    <button type='submit' className='icon icon-send'>
                      <RiIcon.RiSendPlaneFill />
                    </button>

                    <button type='button' className='icon icon-emo'>
                      <FaIcon.FaGift />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {Stream && IsCanPlay ? (
          <ReactHlsPlayer
            src={`${PLAY_STREAM}${Stream.key}/index.m3u8`}
            autoPlay={false}
            muted={false}
            controls={false}
            width='100%'
            height='auto'
            playerRef={videoRef}
          />
        ) : (
          <img className='pause-banner' src={pause} alt='' />
        )}

        <div ref={animationRef} className='live__videoCtn-animation'>
          <div className='live__videoCtn-animation-iconCircle play-icon'>
            <AiIcon.AiFillPlayCircle />
          </div>
          <div className='live__videoCtn-animation-iconCircle pause-icon'>
            <AiIcon.AiFillPauseCircle />
          </div>
          <div className='live__videoCtn-animation-icon mute-icon'>
            <HiIcon.HiVolumeOff />
          </div>
          <div className='live__videoCtn-animation-icon volume-icon'>
            <HiIcon.HiVolumeUp />
          </div>
          <div className='live__videoCtn-animation-icon forward10-icon'>
            <MdIcon.MdForward10 />
          </div>
          <div className='live__videoCtn-animation-icon forward5-icon'>
            <MdIcon.MdForward5 />
          </div>
          <div className='live__videoCtn-animation-icon replay10-icon'>
            <MdIcon.MdReplay10 />
          </div>
          <div className='live__videoCtn-animation-icon replay5-icon'>
            <MdIcon.MdReplay5 />
          </div>
        </div>

        <div
          ref={controlsRef}
          className={`live__videoCtn-controls ${
            isMouseDownVolume || isMouseDownPlayback ? 'show' : ''
          }`}
          style={{ display: Stream && IsCanPlay ? 'flex' : 'none' }}
        >
          <div className='live__videoCtn-controls-top' onClick={() => setIsPlay(x => !x)}></div>

          <div className='live__videoCtn-controls-bottom'>
            <div
              className={`live__videoCtn-controls-bottom-playbackBar ${
                isMouseDownPlayback ? 'show' : ''
              }`}
              style={{ '--playback-percent': playbackPercent }}
              onMouseDown={e => {
                handleAdjustPlaybackMouseDown(e);
                setIsMouseDownPlayback(true);
              }}
            >
              <div className='live__videoCtn-controls-bottom-playbackBar-1'></div>
            </div>

            <div>
              <div
                className='live__videoCtn-controls-bottom-icon play-icon'
                onClick={() => setIsPlay(x => !x)}
              >
                {isPlay ? <BsIcon.BsFillPauseFill /> : <BsIcon.BsFillPlayFill />}
              </div>

              <div
                className='live__videoCtn-controls-bottom-icon volume-icon'
                onClick={handleMuteVideo}
              >
                {currentVolume === 0 ? (
                  <BsIcon.BsFillVolumeMuteFill />
                ) : currentVolume <= 0.5 ? (
                  <BsIcon.BsFillVolumeDownFill />
                ) : (
                  <BsIcon.BsFillVolumeUpFill />
                )}
              </div>

              <div
                className={`live__videoCtn-controls-bottom-volumeBar ${
                  isMouseDownVolume ? 'show' : ''
                }`}
                style={{ '--volume-percent': currentVolume }}
                onMouseDown={e => {
                  handleAdjustVolume(e);
                  setIsMouseDownVolume(true);
                }}
              >
                <div className='live__videoCtn-controls-bottom-volumeBar-1'></div>
                <div className='live__videoCtn-controls-bottom-volumeBar-2'></div>
                <div className='live__videoCtn-controls-bottom-volumeBar-3'></div>
              </div>

              <div className='live__videoCtn-controls-bottom-playbackTime'>{currentTime}</div>
            </div>

            <div>
              <div
                onClick={handleToggleFullscreen}
                className='live__videoCtn-controls-bottom-icon fullscreen-icon'
              >
                {isFullScreen ? <RiIcon.RiFullscreenExitLine /> : <RiIcon.RiFullscreenLine />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
