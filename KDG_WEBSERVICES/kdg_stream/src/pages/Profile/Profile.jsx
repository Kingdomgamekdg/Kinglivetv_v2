import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as FaIcon from 'react-icons/fa';
import * as RiIcon from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../assets/css/profile.css';
import avatarDefault from '../../assets/images/avatarDefault.svg';
import coverDefault from '../../assets/images/coverDefault.jpg';
import callAPI from '../../axios';
import { Crop, PopupBox } from '../../components';
import { STORAGE_DOMAIN } from '../../constant';
import { useLanguage } from '../../context/LanguageLayer';
import { storage } from '../../helpers';
import useNumber from '../../hooks/useNumber';
import { actChangeUploadStatus } from '../../store/action';
import MainContainer from './MainContainer';
import Modal from './Modal';
import ModalBody from './ModalBody';

const posImg = pos => ({
  '--x': pos.x * -1 + '%',
  '--y': pos.y * -1 + '%',
  '--zoom': pos.zoom + '%',
});

const Profile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const uid = new URLSearchParams(useLocation().search).get('uid');
  const user = useSelector(state => state.user);

  const uploadStatus = useSelector(state => state.uploadStatus);
  const [{ language, profile, videoinfo }] = useLanguage();

  const [isFollowed, setIsFollowed] = useState(false);
  const [UserOwner, setUserOwner] = useState({});
  const kinglive = useMemo(() => UserOwner.kinglive, [UserOwner]);

  const [VisiblePickAvatar, setVisiblePickAvatar] = useState(false);

  const [FullScreen, setFullScreen] = useState('');

  const [Image, setImage] = useState('');
  const [ImagePos, setImagePos] = useState({ zoom: 100, x: 0, y: 0 });

  const [Cover, setCover] = useState('');
  const [CoverPos, setCoverPos] = useState({ zoom: 100, x: 0, y: 0 });

  const [videoStreamming, setVideoStreamming] = useState({});

  const MODE = { handleFollow: 'handleFollow' };
  const [mode, setMode] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (uid || !user) return;

    history.push(window.location.pathname + '?uid=' + user._id);
  }, [uid, user, history]);

  const onCancelCrop = useCallback(
    label => {
      dispatch(
        actChangeUploadStatus({
          ...uploadStatus,
          isShowCrop: false,
          _id: null,
        })
      );
      document.getElementById(label).value = null;
      if (label === 'avatar-input') {
        setImage(uploadStatus.currentImage);
      }
      if (label === 'cover-input') {
        setCover(uploadStatus.currentImage);
      }
    },
    [uploadStatus, dispatch]
  );

  const onFinishCrop = useCallback(
    label => {
      dispatch(
        actChangeUploadStatus({
          ...uploadStatus,
          isShowCrop: false,
          _id: null,
        })
      );

      if (label === 'avatar-input') {
        setImage(uploadStatus.image);
        setImagePos(uploadStatus.imagePos);
      }
      if (label === 'cover-input') {
        setCover(uploadStatus.image);
        setCoverPos(uploadStatus.imagePos);
      }

      setVisiblePickAvatar(false);
    },
    [uploadStatus, dispatch]
  );

  const handlePickAvatar = useCallback(() => {
    setVisiblePickAvatar(true);
    dispatch(
      actChangeUploadStatus({
        ...uploadStatus,
        label: 'avatar-input',
        currentImage: Image,
      })
    );
  }, [uploadStatus, dispatch, Image]);

  const handlePickCover = useCallback(() => {
    setVisiblePickAvatar(true);
    dispatch(
      actChangeUploadStatus({
        ...uploadStatus,
        label: 'cover-input',
        currentImage: Cover,
      })
    );
  }, [uploadStatus, dispatch, Cover]);

  const readURLAvatar = useCallback(
    input => {
      input.persist();
      input = input.target;
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = async function (e) {
          let buffer = e.target.result;
          let videoBlob = new Blob([new Uint8Array(buffer)]);
          let url = window.URL.createObjectURL(videoBlob);
          input.parentElement.nextElementSibling.querySelector('img').setAttribute('src', url);
          if (uploadStatus.label === 'avatar-input') {
            setImage(url);
          }
          if (uploadStatus.label === 'cover-input') {
            setCover(url);
          }
          dispatch(
            actChangeUploadStatus({
              ...uploadStatus,
              image: url,
              isShowCrop: true,
            })
          );
        };
        reader.readAsArrayBuffer(input.files[0]);
      }
    },
    [uploadStatus, dispatch]
  );

  const handleFollow = useCallback(async () => {
    try {
      const res = await callAPI.post('/follow?id=' + uid);

      if (res.status === 1) {
        if (isFollowed) toast(videoinfo[language].unfollow_success);
        if (!isFollowed) toast(videoinfo[language].follow_success);

        setIsFollowed(x => !x);
      }
    } catch (error) {
      console.log('Error follow', error);
      toast(videoinfo[language].fail);
    }
  }, [uid, isFollowed, videoinfo, language]);

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

  useEffect(() => {
    if (uid) {
      callAPI.get('/user?uid=' + uid).then(res => {
        document.title = res.data.kyc
          ? `${res.data.kyc.first_name} ${res.data.kyc.last_name}`
          : res.data.email;
        setUserOwner(res.data);
        setIsFollowed(res.data.isFollowed);
        setImage(
          res.data.kyc.avatar?.path ? STORAGE_DOMAIN + res.data.kyc.avatar?.path : avatarDefault
        );
        setImagePos(
          res.data?.kyc?.avatar_pos ? res.data.kyc.avatar_pos : { x: 0, y: 0, zoom: 100 }
        );
        setCover(
          res.data.kyc.cover?.path ? STORAGE_DOMAIN + res.data.kyc.cover?.path : coverDefault
        );
        setCoverPos(res.data?.kyc?.cover_pos ? res.data.kyc.cover_pos : { x: 0, y: 0, zoom: 100 });
      });

      callAPI.get('/streammings?uid=' + uid).then(res => {
        setVideoStreamming(res.data);
      });
    }
  }, [uid]);

  return (
    <div className='profile'>
      {FullScreen && (
        <div onClick={() => setFullScreen(null)} className='fullscreen-mask'>
          <img src={FullScreen} alt='' className='fullscreen' />
        </div>
      )}

      {showPopup && (
        <PopupBox onCancel={setShowPopup}>
          {mode === MODE.handleFollow && (
            <form className='form-confirm' onSubmit={handleSubmitUnfollow}>
              <div className='message'>
                {videoinfo[language].unfollow}{' '}
                <span className='name'>
                  {UserOwner.kyc?.first_name} {UserOwner.kyc?.last_name}
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

      <Modal
        visible={VisiblePickAvatar}
        onCancle={() => setVisiblePickAvatar(false)}
        title={
          uploadStatus.label === 'cover-input'
            ? profile[language].change_cover
            : profile[language].change_avatar
        }
        content={<ModalBody />}
      />

      {uploadStatus?.isShowCrop && <Crop onCancel={onCancelCrop} onFinish={onFinishCrop} />}

      <div className='profile__cover'>
        {uid === user?._id && (
          <form style={{ display: 'none' }} id='cover'>
            <input onChange={readURLAvatar} accept=".png,.jpg,.jpeg" type='file' name='file' id='cover-input' />
          </form>
        )}

        <div className='profile__IMGcover'>
          <img onClick={() => setFullScreen(Cover)} style={posImg(CoverPos)} src={Cover} alt='' />
          <span></span>

          {uid === user?._id && (
            <div className='profile__IMGcover-container2'>
              <div onClick={handlePickCover} className='profile__IMGcover-button'>
                <FaIcon.FaCamera className='icon' />
                <span>{profile[language].change_cover}</span>
              </div>
            </div>
          )}

          {user && user._id !== uid && (
            <div className='profile__IMGcover-container1'>
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
                  {isFollowed ? profile[language].following : profile[language].follow}
                </span>
                <span className='button-new__hiddenText'>{profile[language].unfollow}</span>
              </button>
            </div>
          )}

          {user && user._id === uid && (
            <div className='profile__IMGcover-container1'>
              <div
                className='profile__IMGcover-button'
                onClick={() => {
                  const refresh = storage.getRefresh();
                  window.open(
                    `https://wallet.kingdomgame.org/account?refresh=${refresh}`,
                    '_blank'
                  );
                }}
              >
                <RiIcon.RiUserSettingsLine className='icon' />
                <span>{profile[language].edit}</span>
              </div>
            </div>
          )}
        </div>

        {uid === user?._id && (
          <form style={{ display: 'none' }} id='avatar'>
            <input accept=".png,.jpg,.jpeg" onChange={readURLAvatar} type='file' name='file' id='avatar-input' />
          </form>
        )}

        <div className='profile__infoBox'>
          <div className='profile__IMGavatarBox'>
            <div className='profile__IMGavatar'>
              <img
                onClick={() => setFullScreen(Image)}
                style={posImg(ImagePos)}
                src={Image}
                alt=''
              />
              <span></span>
            </div>

            {uid === user?._id && (
              <div onClick={handlePickAvatar} className='profile__IMGavatarBox-button'>
                <FaIcon.FaCamera className='icon' />
              </div>
            )}
          </div>

          <div className='profile__name'>
            {UserOwner.kyc?.first_name} {UserOwner.kyc?.last_name}
          </div>

          <div className='layoutFlex layout-3 mt-5' style={{ '--gap-column': '10px' }}>
            <div className='layoutFlex-item profile__info'>
              <p>{profile[language].followers}</p>
              <p>{useNumber(kinglive?.total_follower)}</p>
            </div>

            <div className='layoutFlex-item profile__info'>
              <p>{profile[language].following}</p>
              <p>{useNumber(kinglive?.total_followed)}</p>
            </div>

            <div className='layoutFlex-item profile__info'>
              <p>{profile[language].total_view}</p>
              <p>{useNumber(kinglive?.total_view)}</p>
            </div>
          </div>
        </div>
      </div>

      <MainContainer
        UserOwner={UserOwner}
        uid={uid}
        user={user}
        videoStreamming={videoStreamming}
      />
    </div>
  );
};

export default Profile;
