import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as FaIcon from 'react-icons/fa';
import * as RiIcon from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../assets/css/live.css';
import callAPI from '../../axios';
import { Avatar, Recommend, VideoInfo } from '../../components';
import { STORAGE_DOMAIN } from '../../constant';
import { useLanguage } from '../../context/LanguageLayer';
import socket from '../../socket';
import { actChangeGifts } from '../../store/authAction';
import VideoPlayer from './VideoPlayer';

const Live = () => {
  const [{ language, live }] = useLanguage();

  const dispatch = useDispatch();
  const history = useHistory();
  const balance = useSelector(state => state.balanceKDG);
  const user = useSelector(state => state.user);
  const chatRef = useRef();
  const boxChatRef = useRef();
  const loadingChatRef = useRef(true);
  const haveMoreChatRef = useRef(true);
  const [ReEffect, setReEffect] = useState(0);
  const [Stream, setStream] = useState({});
  const [IsCanPlay, setIsCanPlay] = useState(false);
  const [Chat, setChat] = useState([]);
  const [ListGift, setListGift] = useState([]);
  const [IsShowGifts, setIsShowGifts] = useState(false);
  const [isHideChat, setIsHideChat] = useState(false);
  const id = new URLSearchParams(window.location.search).get('s');

  const [viewing, setViewing] = useState('0');

  useEffect(() => {
    let streamId;
    callAPI.get('/streamming?id=' + id).then(res => {
      if (!res.data) return;

      document.title = res.data.name;
      if (res.data.status === 2) {
        history.push('/');
      }

      socket.emit('join_stream', res.data._id);
      streamId = res.data._id;
      setStream(res.data);
      setViewing(res.data.viewing);
      if (res.data.connect_status === 1) setIsCanPlay(true);
    });

    callAPI.get('/chats?stream=' + id).then(res => {
      setChat([...res.data]);
      loadingChatRef.current = false;
      document.querySelectorAll('.live__chatBox-top').forEach(el => {
        el.scroll(0, el.scrollHeight + 9999);
      });
      if (res.data.length < 50) {
        haveMoreChatRef.current = false;
      }
    });

    const handleReceiveChat = function (chatData) {
      setChat(_chat => {
        return [..._chat, chatData];
      });
    };
    socket.on('chat', handleReceiveChat);

    const handleViewing = function (totalViewing) {
      setViewing(totalViewing);
    };
    socket.on('viewing', handleViewing);

    const handleReceiveGift = gift => {
      setChat(_chat => [
        ..._chat,
        {
          type: 2,
          chat: live[language].receive_gift
            .replace('username', gift.user_name)
            .replace('gift_name', gift.gift_name),
        },
      ]);

      setListGift(_listGift => {
        return [..._listGift, gift];
      });
    };
    socket.on('gift', handleReceiveGift);

    const handleListGift = listGift => {
      console.log(listGift);
      dispatch(actChangeGifts(listGift));
    };
    socket.on('list_gift', handleListGift);

    const handleStream = stream => {
      if (stream.connect_status === 1) {
        setTimeout(() => {
          setIsCanPlay(true);
        }, 5000);
      } else if (stream.connect_status === 0) {
        setIsCanPlay(false);
      }

      if (stream.status === 2) {
        history.push('/');
      }
    };
    socket.on('stream', handleStream);

    return () => {
      socket.emit('leave_stream', streamId);
      setChat([]);
      socket.removeEventListener('chat', handleReceiveChat);
      socket.removeEventListener('gift', handleReceiveGift);
      socket.removeEventListener('list_gift', handleListGift);
      socket.removeEventListener('stream', handleStream);
      socket.removeEventListener('viewing', handleViewing);
    };
  }, [dispatch, id, history, language, live]);

  useEffect(() => {
    document.querySelectorAll('.live__chatBox-top').forEach(el => {
      el.scroll(0, el.scrollHeight + 9999);
    });

    document.querySelectorAll('.live__chatfullscreen-top').forEach(el => {
      el.scroll(0, el.scrollHeight + 9999);
    });
  }, [Chat]);

  const handleChat = useCallback(
    e => {
      e.preventDefault();
      const data = new FormData(e.target);
      const chat = data.get('chat');
      if (!chat) return;
      socket.emit('chat', { room: Stream._id, chat });
      e.target.reset();
    },
    [Stream]
  );

  const Gifts = useSelector(state => state.gifts);

  const handleSendGift = useCallback(
    async gift_id => {
      const res = await callAPI.post('/send_gift', { gift: gift_id, to: Stream.user._id });
      if (res.status === 1) toast(live[language].sent_gift);
      if (res.status === 101) toast(live[language].not_enough_money);
    },
    [Stream, live, language]
  );

  useEffect(() => {
    const hideGift = () => {
      IsShowGifts && setIsShowGifts(false);
    };

    window.addEventListener('click', hideGift);

    return () => {
      window.removeEventListener('click', hideGift);
    };
  }, [IsShowGifts]);

  // const handlePin = useCallback(async (chat_id) => {
  //   await callAPI.post('/pin' , {chat_id})
  // },[])

  useEffect(() => {
    console.log(boxChatRef);
    if (!boxChatRef.current) {
      setTimeout(() => {
        setReEffect(ReEffect + 1);
      }, 50);
    }
    if (boxChatRef.current) {
      const boxChat = boxChatRef.current;
      boxChat.onscroll = () => {
        console.log(loadingChatRef.current, boxChat.scrollTop);
        if (!loadingChatRef.current && haveMoreChatRef.current && boxChat.scrollTop <= 50) {
          loadingChatRef.current = true;
          callAPI.get(`/chats?stream=${id}&prev=${Chat[0]?._id}`).then(res => {
            console.log(res);
            setChat([...res.data, ...Chat]);
            loadingChatRef.current = false;
            if (res.data.length < 50) {
              haveMoreChatRef.current = false;
            }
          });
        }
      };
    }
  }, [id, Chat, ReEffect]);

  return (
    <div className='live'>
      <div className='live__left'>
        <VideoPlayer
          Chat={Chat}
          Stream={Stream}
          handleChat={handleChat}
          ListGift={ListGift}
          setListGift={setListGift}
          isHideChat={isHideChat}
          setIsHideChat={setIsHideChat}
          chatRef={chatRef}
          IsCanPlay={IsCanPlay}
        />
        <VideoInfo id={id} type='live' viewing={viewing} />
      </div>

      <div className='live__right'>
        {user && (
          <div className='live__chat'>
            <div className={`live__chatBox ${isHideChat ? 'd-none' : ''}`}>
              <div ref={boxChatRef} className='live__chatBox-top'>
                {Chat.map((o, i) =>
                  o.type === 2 ? (
                    <div style={{ color: '#f52871', fontSize: '22px', fontWeight: '500' }}>
                      {o.chat}
                    </div>
                  ) : (
                    <div className='live__chatBox-top-ctn' key={i}>
                      <div className='live__chatBox-top-ctn-avatar'>
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
                        <div className='live__chatBox-top-ctn-name'>
                          {o.user?.kyc.first_name || o.user?.kyc.last_name
                            ? `${o.user?.kyc.first_name} ${o.user?.kyc.last_name}`
                            : `User ${o.user?._id}`}
                          {':'}
                        </div>
                        <div className='live__chatBox-top-ctn-text'>{o.chat}</div>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className='live__chatBox-bottom'>
                <div className='live__chatBox-bottom-chat'>
                  <div className='live__chatBox-bottom-chat-avatar'>
                    <Avatar
                      src={
                        user?.kyc.avatar?.path ? STORAGE_DOMAIN + user?.kyc.avatar?.path : undefined
                      }
                      position={user?.kyc.avatar_pos}
                    />
                  </div>

                  <form onSubmit={handleChat} className='live__chatBox-bottom-chat-inputBox'>
                    <input
                      ref={chatRef}
                      name='chat'
                      type='text'
                      placeholder={live[language].chathere}
                    />

                    <button type='submit' className='icon icon-send'>
                      <RiIcon.RiSendPlaneFill />
                    </button>

                    <div className='icon icon-gift'>
                      <div className={`popup-gift ${IsShowGifts ? 'show' : ''}`}>
                        <span className='popup-gift__balance'>
                          {live[language].balance} {Math.floor(balance * 100) / 100} KDG
                        </span>

                        <div
                          className='layoutFlex layout-3 popup-gift__gift'
                          style={{
                            '--gap-column': '0px',
                            '--gap-row': '10px',
                            maxHeight: '500px',
                            overflowY: 'auto',
                            padding: '10px',
                          }}
                        >
                          {Gifts?.map(o => (
                            <div className='layoutFlex-item'>
                              <div
                                key={o._id}
                                onClick={() => handleSendGift(o._id)}
                                className='item'
                              >
                                <img src={o.img} alt='' />
                                <span className='name'>{o.name}</span>
                                <span className='price'>{Math.ceil(o.price * 100) / 100} KDG</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div onClick={() => setIsShowGifts(x => !x)} className='icon-gift-button'>
                        <FaIcon.FaGift />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className='live__chatBtn' onClick={() => setIsHideChat(x => !x)}>
              {isHideChat ? live[language].showchat : live[language].hidechat}
            </div>
          </div>
        )}

        <Recommend id={id} />
      </div>
    </div>
  );
};

export default Live;
