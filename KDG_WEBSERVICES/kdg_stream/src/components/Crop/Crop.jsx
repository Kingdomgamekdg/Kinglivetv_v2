import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import '../../assets/css/crop.css';
import callAPI from '../../axios';
import { useLanguage } from '../../context/LanguageLayer';
import { actChangeUploadStatus } from '../../store/action';

export default function Crop({ onCancel = () => {}, onFinish = () => {} }) {
  const dispatch = useDispatch();
  const uploadStatus = useSelector(state => state.uploadStatus);
  const { image, imagePos, label, _id } = uploadStatus || {};
  const [{ language, cropLang }] = useLanguage();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1000);

  const onCropComplete = useCallback(
    ({ x, y, width }) => {
      dispatch(
        actChangeUploadStatus({
          ...uploadStatus,
          imagePos: {
            x,
            y,
            zoom: 10000 / width,
          },
        })
      );
    },
    [uploadStatus, dispatch]
  );

  const handleUploadAvatar = useCallback(async () => {
    const type = label === 'avatar-input' ? 1 : 2;

    if (_id) {
      try {
        callAPI.post(`/avatar?avatar=${_id}&type=${type}`);
        toast(cropLang[language].change_success);
      } catch (error) {
        console.log('change img', error);
        toast(cropLang[language].change_fail);
      }
    } else {
      const data = new FormData();
      data.append('file', document.getElementById(label).files[0]);
      try {
        callAPI.post(`/avatar?type=${type}`, data);
        toast(cropLang[language].change_success);
      } catch (error) {
        console.log('change img', error);
        toast(cropLang[language].change_fail);
      }
    }

    callAPI.post(`/avatar_pos?type=${type}`, imagePos);
    document.getElementById(label).value = null;
    onFinish(label);
  }, [imagePos, label, _id, onFinish, cropLang, language]);

  return (
    <div className={`crop-container ${label === 'avatar-input' ? 'avatar-crop' : ''}`}>
      <Cropper
        image={image}
        zoom={zoom / 1000}
        crop={crop}
        aspect={label === 'avatar-input' ? 1 / 1 : 3 / 1}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
        showGrid={false}
        zoomWithScroll={false}
      />
      <input
        min='1000'
        max='3000'
        value={zoom}
        onChange={e => setZoom(e.target.value)}
        type='range'
        name=''
        id=''
      />
      <div className='btn-group'>
        <button onClick={handleUploadAvatar} className='button'>
          <span>{cropLang[language].confirm}</span>
        </button>

        <button onClick={() => onCancel(label)} className='button'>
          <span>{cropLang[language].cancel}</span>
        </button>
      </div>
    </div>
  );
}
