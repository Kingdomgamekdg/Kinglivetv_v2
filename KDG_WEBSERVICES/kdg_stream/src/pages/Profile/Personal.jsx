import { CircularProgress } from '@material-ui/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as AiIcon from 'react-icons/ai';
import * as BiIcon from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import callAPI from '../../axios';
import { CreateDate, MenuBox, PopupBox } from '../../components';
import { BREAK_POINT_SMALL, BREAK_POINT_EXTRA_EXTRA_SMALL, STORAGE_DOMAIN } from '../../constant';
import { useLanguage } from '../../context/LanguageLayer';
import { convertTime } from '../../helpers';
import useWindowSize from '../../hooks/useWindowSize';
import { actChangeVideoEditing, actChangeVideoDeleting } from '../../store/action';

export default function Personal({ UserOwner, videoStreamming }) {
  const uid = new URLSearchParams(useLocation().search).get('uid');
  const user = useSelector(state => state.user);
  const videoEditting = useSelector(state => state.videoEditting);
  const videoDeleting = useSelector(state => state.videoDeleting);

  const [videoPinned, setVideoPinned] = useState(UserOwner?.kinglive?.introduce);
  useEffect(() => setVideoPinned(UserOwner?.kinglive?.introduce), [UserOwner]);

  const history = useHistory();
  const dispatch = useDispatch();
  const [{ language, profile }] = useLanguage();
  const [width] = useWindowSize();
  const [isLoading, setIsLoading] = useState(false);
  const [Videos, setVideos] = useState([]);

  const isLoadMore = useRef(true);
  const isLoadingAPI = useRef(false);
  const isLoadFirst = useRef(true);

  const getVideo = useCallback(async () => {
    const limit = 10;

    const res = await callAPI.get(
      `/videos?user=${uid}&limit=${limit}&last=${Videos[Videos.length - 1]?._id}`
    );

    if (res.data.length === 0) {
      isLoadMore.current = false;
      setVideos([...Videos, ...res.data]);
      return;
    }

    setVideos([...Videos, ...res.data]);
  }, [Videos, uid]);

  useEffect(() => {
    const handleLoad = async () => {
      const totalHeight = document.getElementById('root').clientHeight;
      const scrolledHeight = window.scrollY + window.innerHeight;
      const restHeight = totalHeight - scrolledHeight;
      const isEnd = restHeight <= 500;

      if (isEnd && isLoadMore.current && !isLoadingAPI.current) {
        isLoadingAPI.current = true;
        setIsLoading(true);
        await getVideo();
        setIsLoading(false);
        isLoadingAPI.current = false;
      }
    };

    if (uid && !isLoadingAPI.current && isLoadFirst.current) {
      isLoadFirst.current = false;
      getVideo();
    }

    window.addEventListener('scroll', handleLoad);

    return () => {
      window.removeEventListener('scroll', handleLoad);
    };
  }, [getVideo, uid]);

  const handleSetIntroduce = useCallback(
    async o => {
      try {
        await callAPI.post('/set_introduce', { video: o._id });
        setVideoPinned(o);

        toast(profile[language].set_introduce_success);
      } catch (error) {
        console.log('Error set intro', error);
        toast(profile[language].fail);
      }
    },
    [profile, language]
  );

  const handleEditVideo = useCallback(
    async e => {
      e.preventDefault();
      const data = new FormData(e.target);
      const submitData = {};
      for (const iterator of data.entries()) {
        submitData[iterator[0]] = iterator[1];
      }

      try {
        const res = await callAPI.put(`/video?id=${videoEditting._id}`, submitData);

        if (videoPinned && videoPinned._id === videoEditting._id) {
          setVideoPinned(res.data);
        }

        const videoIndex = Videos.findIndex(o => o._id === videoEditting._id);
        Videos[videoIndex] = res.data;
        setVideos([...Videos]);

        setShowPopup(false);
        toast(profile[language].edit_success);
      } catch (error) {
        console.log('Error edit video', error);
        toast(profile[language].fail);
      }
    },
    [videoEditting, Videos, profile, language, videoPinned]
  );

  const handleDeleteVideo = useCallback(
    async e => {
      e.preventDefault();

      try {
        await callAPI.delete(`/video?id=${videoDeleting._id}`);

        if (videoPinned && videoPinned._id === videoDeleting._id) {
          setVideoPinned(null);
        }

        const newVideos = Videos.filter(video => video._id !== videoDeleting._id);
        setVideos(newVideos);

        setShowPopup(false);
        toast(profile[language].delete_success);
      } catch (error) {
        console.log('Error delete video', error);
        toast(profile[language].fail);
      }
    },
    [Videos, videoDeleting, videoPinned, profile, language]
  );

  const [showPopup, setShowPopup] = useState(false);
  const MODE = { edit: 'edit', delete: 'delete' };
  const [mode, setMode] = useState(MODE.edit);

  return (
    <>
      {showPopup && (
        <PopupBox onCancel={setShowPopup}>
          {mode === MODE.edit && (
            <form className='form-edit' onSubmit={handleEditVideo}>
              <div className='label'>{profile[language].title}</div>
              <input type='text' name='name' defaultValue={videoEditting?.name} />

              <div className='label'>{profile[language].desc}</div>
              <textarea name='description' defaultValue={videoEditting?.description}></textarea>

              <div className='label'>{profile[language].tags}</div>
              <input type='text' name='tags' defaultValue={videoEditting?.tags.join()} />

              <button style={{ width: '100%' }} className='button'>
                {profile[language].edit}
              </button>
            </form>
          )}

          {mode === MODE.delete && (
            <form className='form-confirm' onSubmit={handleDeleteVideo}>
              <div className='message'>
                {profile[language].are_you_sure_delete} <span>{videoDeleting.name}</span>?
              </div>
              <div className='action'>
                <button type='submit' className='mr-20'>
                  {profile[language].confirm}
                </button>
                <button type='button' onClick={() => setShowPopup(false)}>
                  {profile[language].cancel}
                </button>
              </div>
            </form>
          )}
        </PopupBox>
      )}

      {videoPinned && (
        <div className='video-pinned'>
          <div className='video-pinned__videoBox'>
            <iframe
              title='video'
              loading='lazy'
              allowFullScreen={true}
              src={`https://iframe.mediadelivery.net/embed/1536/${videoPinned.guid}?autoplay=false`}
              allow='accelerometer; gyroscope; encrypted-media; picture-in-picture;'
            ></iframe>
          </div>

          <div className='video-pinned__videoInfoBox'>
            {uid === user?._id && (
              <MenuBox>
                <div
                  className='menuBox__menuItem'
                  onClick={() => {
                    dispatch(actChangeVideoEditing(videoPinned));
                    setMode(MODE.edit);
                    setShowPopup(true);
                  }}
                >
                  <BiIcon.BiEditAlt className='icon' />
                  {profile[language].edit}
                </div>
                <div
                  className='menuBox__menuItem'
                  onClick={() => {
                    dispatch(actChangeVideoDeleting(videoPinned));
                    setMode(MODE.delete);
                    setShowPopup(true);
                  }}
                >
                  <AiIcon.AiOutlineDelete className='icon' />
                  {profile[language].delete}
                </div>
              </MenuBox>
            )}

            <div
              className='video-pinned__videoInfoBox-title'
              onClick={() => {
                window.scrollTo(0, 0);
                history.push('/watch?v=' + videoPinned.short_id);
              }}
            >
              {videoPinned.name}
            </div>
            <div className='video-pinned__videoInfoBox-view'>
              <span>
                {videoPinned.views} {profile[language].views}
              </span>
              <span> • </span>
              <CreateDate create_date={videoPinned.create_date} />
            </div>
            <div className='video-pinned__videoInfoBox-description'>{videoPinned.description}</div>
          </div>
        </div>
      )}

      {videoStreamming?.[0] && (
        <div className='profile__personalBox'>
          <div className='profile__personalBox-title'>Stream</div>

          <div
            className={`layoutFlex ${
              width > BREAK_POINT_SMALL
                ? 'layout-3'
                : width > BREAK_POINT_EXTRA_EXTRA_SMALL
                ? 'layout-2'
                : 'layout-1'
            }`}
            style={{ '--gap-row': '15px', '--gap-column': '15px' }}
          >
            <div
              className='layoutFlex-item'
              onClick={() => {
                window.scrollTo(0, 0);
                history.push('/live?s=' + videoStreamming._id);
              }}
            >
              <div className='profile__video'>
                <div className='profile__video-thumbnail'>
                  <img src={`${STORAGE_DOMAIN}${videoStreamming.thumbnail?.path}`} alt='' />
                </div>

                <div className='profile__video-info'>
                  <div className='profile__video-info-title'>{videoStreamming.name}</div>
                  <div className='profile__video-info-view'>
                    <span>
                      {videoStreamming.views} {profile[language].views}
                    </span>
                    <span> • </span>
                    <CreateDate create_date={videoStreamming.start_date} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {Videos.length > 0 && (
        <div className='profile__personalBox'>
          <div className='profile__personalBox-title'>{profile[language].video_upload}</div>

          <div
            className={`layoutFlex ${
              width > BREAK_POINT_SMALL
                ? 'layout-3'
                : width > BREAK_POINT_EXTRA_EXTRA_SMALL
                ? 'layout-2'
                : 'layout-1'
            }`}
            style={{ '--gap-row': '15px', '--gap-column': '15px' }}
          >
            {Videos.map(o => (
              <div
                key={o._id}
                className='layoutFlex-item'
                onClick={() => history.push('/watch?v=' + o.short_id)}
                onMouseEnter={e => {
                  let target = e.target;
                  while (true) {
                    if (Array.from(target.classList).includes('layoutFlex-item')) {
                      break;
                    } else {
                      target = target.parentElement;
                    }
                  }
                  const targat = target.querySelector('img');
                  targat.setAttribute(
                    'src',
                    `https://vz-3f44931c-ed0.b-cdn.net/${o.guid}/preview.webp`
                  );
                }}
                onMouseLeave={e => {
                  let target = e.target;
                  while (true) {
                    if (Array.from(target.classList).includes('layoutFlex-item')) {
                      break;
                    } else {
                      target = target.parentElement;
                    }
                  }
                  const targat = target.querySelector('img');
                  targat.setAttribute(
                    'src',
                    `https://vz-3f44931c-ed0.b-cdn.net/${o.guid}/thumbnail.jpg`
                  );
                }}
              >
                <div className='profile__video'>
                  <div className='profile__video-thumbnail'>
                    <img
                      src={
                        o.thumbnail
                          ? STORAGE_DOMAIN + o.thumbnail.path
                          : `https://vz-3f44931c-ed0.b-cdn.net/${o.guid}/thumbnail.jpg`
                      }
                      alt=''
                    />
                    <span className='profile__video-duration'>{convertTime(o.duration)}</span>
                  </div>

                  <div className='profile__video-info'>
                    {uid === user?._id && (
                      <MenuBox>
                        <div className='menuBox__menuItem' onClick={() => handleSetIntroduce(o)}>
                          <AiIcon.AiOutlinePushpin className='icon' />
                          {profile[language].set_introduce}
                        </div>
                        <div
                          className='menuBox__menuItem'
                          onClick={() => {
                            dispatch(actChangeVideoEditing(o));
                            setMode(MODE.edit);
                            setShowPopup(true);
                          }}
                        >
                          <BiIcon.BiEditAlt className='icon' />
                          {profile[language].edit}
                        </div>
                        <div
                          className='menuBox__menuItem'
                          onClick={() => {
                            dispatch(actChangeVideoDeleting(o));
                            setMode(MODE.delete);
                            setShowPopup(true);
                          }}
                        >
                          <AiIcon.AiOutlineDelete className='icon' />
                          {profile[language].delete}
                        </div>
                      </MenuBox>
                    )}

                    <div className='profile__video-info-title'>{o.name}</div>
                    <div className='profile__video-info-view'>
                      <span>
                        {o.views} {profile[language].views}
                      </span>
                      <span> • </span>
                      <CreateDate create_date={o.create_date} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isLoading && (
            <CircularProgress
              color='inherit'
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                margin: '20px',
                color: '#e41a7f',
              }}
            />
          )}
        </div>
      )}

      {/* <div className='profile__boxPersonal'>
        <div className='profile__boxPersonal-title'>Tra Long's recently streamed Categories</div>
        <div
          className={`layoutFlex ${
            width > 1330
              ? 'layout-4'
              : width > 1030
              ? 'layout-3'
              : width > 570
              ? 'layout-2'
              : 'layout-1'
          }`}
          style={{ '--gap-row': '40px', '--gap-column': '40px' }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(el => (
            <div
              key={el}
              className='layoutFlex-item profile__video2'
              onClick={() => history.push('/live')}
            >
              <div className='profile__video2-thumbnail'>
                <img src={video4} alt='' />
              </div>
              <p className='profile__video2-title'>Play game</p>
            </div>
          ))}
        </div>
      </div> */}
    </>
  );
}
