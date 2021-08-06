import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as BiIcon from 'react-icons/bi';
import * as RiIcon from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Avatar, CreateDate, PopupBox } from '..';
import '../../assets/css/video-info.css';
import callAPI from '../../axios';
import { STORAGE_DOMAIN } from '../../constant';
import { useLanguage } from '../../context/LanguageLayer';
import useNumber from '../../hooks/useNumber';

const VideoInfo = props => {
  const { id, type = 'watch', viewing = 0 } = props;

  const [{ videoinfo, language }] = useLanguage();
  const history = useHistory();
  const user = useSelector(state => state.user);

  const [showMore, setShowMore] = useState(true);

  const [video, setVideo] = useState(null);
  const views = useNumber(video?.views);
  const _viewing = useNumber(viewing);

  const [comments, setComments] = useState([]);
  const [totalComment, setTotalComment] = useState(0);
  const [isShowLoadmore, setIsShowLoadmore] = useState(true);

  const _totalComment = useNumber(totalComment);

  const [totalFollow, setTotalFollow] = useState(0);
  const [isFollowed, setIsFollowed] = useState(false);

  const MODE = { handleFollow: 'handleFollow' };
  const [mode, setMode] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleFollow = useCallback(async () => {
    try {
      const res = await callAPI.post(`follow?id=${video?.user._id}`);

      if (res.status === 1) {
        if (isFollowed) toast(videoinfo[language].unfollow_success);
        if (!isFollowed) toast(videoinfo[language].follow_success);

        setIsFollowed(x => !x);
      }
    } catch (error) {
      console.log('Error follow', error);
      toast(videoinfo[language].fail);
    }
  }, [video, isFollowed, videoinfo, language]);

  const handleConfirmUnfollow = useCallback(() => {
    setMode(MODE.handleFollow);
    setShowPopup(true);
  }, [MODE.handleFollow]);

  const handleSubmitUnfollow = useCallback(
    e => {
      e.preventDefault();

      setMode(null);
      setShowPopup(false);

      handleFollow();
    },
    [handleFollow]
  );

  const handleComment = useCallback(
    async e => {
      e.preventDefault();

      if (video?._id) {
        const data = new FormData(e.target);
        const res = await callAPI.post(`/comment?video=${video._id}`, {
          comment: data.get('comment'),
        });

        setComments(comments => [res.data, ...comments]);

        e.target.reset();
      }
    },
    [video]
  );

  const handleGetComment = useCallback(async (videoId, next) => {
    const res = await callAPI.get(`/comment?video=${videoId}&next=${next}`);
    setComments(comment => [...comment, ...res.data]);
    setTotalComment(res.total);

    if (res.data.length === 10) {
      setIsShowLoadmore(true);
    } else {
      setIsShowLoadmore(false);
    }
  }, []);

  useMemo(() => {
    if (id) {
      if (type === 'watch') {
        callAPI.get('/video?sid=' + id).then(res => {
          setVideo(res.data);
          setIsFollowed(res.is_followed);
          setTotalFollow(res.data.user?.kinglive?.total_follower);
          callAPI.get(`/comment?video=${res.data._id}&next=`).then(resComment => {
            setComments([...resComment.data]);
            setTotalComment(resComment.total);
            if (resComment.data.length === 10) {
              setIsShowLoadmore(true);
            } else {
              setIsShowLoadmore(false);
            }
          });
        });
      } else {
        callAPI.get('/streamming?id=' + id).then(res => {
          setVideo(res.data);
          setIsFollowed(res.is_followed);
          setTotalFollow(res.data.user?.kinglive?.total_follower);
        });
      }
    }
  }, [id, type]);

  const descRef = useRef();
  const [showMoreBTN, setShowMoreBTN] = useState(true);
  const firstRunRef = useRef(true);
  useEffect(() => {
    if (!descRef.current) return;
    if (descRef.current.clientHeight === 0) return;

    if (firstRunRef.current) {
      if (descRef.current.clientHeight > 96) {
        setShowMoreBTN(true);
        setShowMore(false);
      } else {
        setShowMoreBTN(false);
      }

      firstRunRef.current = false;
    }
  }, [descRef.current?.clientHeight]);

  // const handleShareZalo = () => {
  //   const app_id = 2192398247409559850;
  //   const redirect_uri = 'https://kinglive.tv/';
  //   const state = '123';

  //   try {
  //     const res1 = callAPI.get(
  //       `https://oauth.zaloapp.com/v3/auth?app_id=${app_id}&redirect_uri=${redirect_uri}&state=${state}`
  //     );
  //     console.log({ res1 });
  //   } catch (error) {
  //     console.error('Error When Share Zalo', error);
  //   }
  // };

  return (
    <div className='videoInfo'>
      {showPopup && (
        <PopupBox onCancel={setShowPopup}>
          {mode === MODE.handleFollow && (
            <form className='form-confirm' onSubmit={handleSubmitUnfollow}>
              <div className='message'>
                {videoinfo[language].unfollow}{' '}
                <span className='name'>
                  {video?.user?.kyc.first_name} {video?.user?.kyc.last_name}
                </span>
                <span>?</span>
                <br />
                <span className='text'>{videoinfo[language].message_unfollow}</span>
              </div>
              <div className='action'>
                <button type='submit' className='mr-20'>
                  {videoinfo[language].confirm}
                </button>
                <button type='button' onClick={() => setShowPopup(false)}>
                  {videoinfo[language].cancel}
                </button>
              </div>
            </form>
          )}
        </PopupBox>
      )}

      <div className='videoInfo__title'>
        <span>{video?.name}</span>
      </div>

      <div className='videoInfo__descTitle'>
        {type === 'watch' && (
          <span>
            {views} {videoinfo[language].views}
          </span>
        )}
        {type === 'live' && (
          <span>
            {_viewing} {videoinfo[language].watching}
          </span>
        )}
        <span> • </span>
        {type === 'watch' && <CreateDate create_date={video?.create_date} />}
        {type === 'live' && <CreateDate create_date={video?.last_start} />}
      </div>

      <div className='videoInfo__share'>
        <BiIcon.BiShare
          className='icon button-shareFb'
          onClick={() => {
            window.FB.ui(
              {
                display: 'popup',
                method: 'share',
                href: `https://kinglive.tv/live?s=${id}`,
              },
              res => {
                console.log({ res });
              }
            );
          }}
        />

        {/* <BiIcon.BiShare className='icon button-shareZalo' onClick={handleShareZalo} /> */}
      </div>

      <div className='videoInfo__info'>
        <div
          className='videoInfo__avatar'
          onClick={() => {
            window.scrollTo(0, 0);
            history.push('/profile?uid=' + video?.user._id);
          }}
        >
          <Avatar
            src={
              video?.user?.kyc.avatar?.path
                ? STORAGE_DOMAIN + video?.user?.kyc.avatar?.path
                : undefined
            }
            position={video?.user?.kyc.avatar_pos}
          />
        </div>

        <div>
          <div className='videoInfo__name'>
            {video?.user?.kyc.first_name} {video?.user?.kyc.last_name}
          </div>

          <div className='videoInfo__followers'>
            <span>
              {useNumber(totalFollow)} {videoinfo[language].followers}
            </span>
          </div>

          <div ref={descRef} className={`videoInfo__desc ${showMore ? 'd-block' : ''}`}>
            {video?.description}
          </div>

          {showMoreBTN && (
            <div className='videoInfo__showMore' onClick={() => setShowMore(x => !x)}>
              {showMore ? videoinfo[language].hide : videoinfo[language].showmore}
            </div>
          )}
        </div>

        {user && user?._id !== video?.user._id && (
          <div className='videoInfo__action'>
            <button
              onClick={isFollowed ? handleConfirmUnfollow : handleFollow}
              className={`button-new ${isFollowed ? 'active' : ''}`}
            >
              {isFollowed ? (
                <RiIcon.RiUserUnfollowLine className='icon' />
              ) : (
                <RiIcon.RiUserFollowLine className='icon' />
              )}
              <span className='button-new__text'>
                {isFollowed ? videoinfo[language].following : videoinfo[language].follow}
              </span>
              <span className='button-new__hiddenText'>{videoinfo[language].unfollow}</span>
            </button>
          </div>
        )}
      </div>

      {user && type === 'watch' && (
        <div className='videoInfo__comment'>
          <div className='videoInfo__comment-total'>
            {_totalComment} {videoinfo[language].comment}
          </div>

          <div className='videoInfo__comment-input'>
            <div className='left'>
              <Avatar
                src={user?.kyc.avatar?.path ? STORAGE_DOMAIN + user?.kyc.avatar?.path : undefined}
                position={user?.kyc.avatar_pos}
              />
            </div>

            <form onSubmit={handleComment} className='right'>
              <input placeholder={videoinfo[language].comment} type='text' name='comment' />
              <span className='effect'></span>
            </form>
          </div>

          <div className='videoInfo__comment-list'>
            {comments.map(o => (
              <div className='comment' key={o._id}>
                <div
                  className='left'
                  onClick={() => {
                    window.scrollTo(0, 0);
                    history.push(`/profile?uid=${o.user?._id}`);
                  }}
                >
                  <Avatar
                    src={
                      o?.user?.kyc.avatar?.path
                        ? STORAGE_DOMAIN + o?.user?.kyc.avatar?.path
                        : undefined
                    }
                    position={o?.user?.kyc.avatar_pos}
                  />
                </div>

                <div className='right'>
                  <div className='name'>
                    <span
                      onClick={() => {
                        window.scrollTo(0, 0);
                        history.push(`/profile?uid=${o.user?._id}`);
                      }}
                    >
                      {o.user.kyc.first_name} {o.user.kyc.last_name}
                    </span>
                    <span> • </span>
                    <CreateDate create_date={o.create_date} />
                  </div>
                  <div className='content'>{o.comment}</div>
                </div>
              </div>
            ))}

            {isShowLoadmore && (
              <div
                className='videoInfo__showMore'
                onClick={() => handleGetComment(video._id, comments[comments.length - 1]?._id)}
              >
                {videoinfo[language].loadmore}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoInfo;
