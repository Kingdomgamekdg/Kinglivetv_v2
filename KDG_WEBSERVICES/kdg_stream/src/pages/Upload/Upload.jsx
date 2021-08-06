import React, { useCallback, useEffect, useState } from 'react';
import * as GoIcon from 'react-icons/go';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../assets/css/upload.css';
import callAPI from '../../axios';
import { BREAK_POINT_EXTRA_EXTRA_SMALL } from '../../constant';
import { useLanguage } from '../../context/LanguageLayer';
import { useWindowSize } from '../../hooks';
import socket from '../../socket';

const Upload = () => {
  const history = useHistory();
  const [{ language, upload }] = useLanguage();
  const [width] = useWindowSize();

  const [Guid, setGuid] = useState(null);
  const [ShortId, setShortId] = useState(null);
  const [IsUploading, setIsUploading] = useState(false);
  const [Status, setStatus] = useState(null);
  const [StatusCode, setStatusCode] = useState(null);
  const [VideoSrc, setVideoSrc] = useState(null);
  const [Progress, setProgress] = useState('0%');

  const [VideoTitle, setVideoTitle] = useState('');
  const [VideoDesc, setVideoDesc] = useState('');
  const [VideoTag, setVideoTag] = useState('');

  const readURL = useCallback(
    input => {
      input.persist();
      input = input.target;

      if (input.files && input.files[0]) {
        if (!VideoTitle) setVideoTitle(input.files[0].name);
        if (!VideoDesc) setVideoDesc(input.files[0].name);

        var reader = new FileReader();

        reader.onload = function (e) {
          let buffer = e.target.result;
          let videoBlob = new Blob([new Uint8Array(buffer)], { type: 'video/mp4' });
          let url = window.URL.createObjectURL(videoBlob);
          setVideoSrc(url);
        };

        reader.readAsArrayBuffer(input.files[0]);
      }
    },
    [VideoTitle, VideoDesc]
  );

  const handleUpload = useCallback(
    async e => {
      e.preventDefault();

      if (IsUploading) return;
      setIsUploading(true);

      const data = new FormData(e.target);

      setStatus(upload[language].uploading);
      setStatusCode(null);

      const res = await callAPI.post('/upload_video', data, true, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: e => {
          if (e.lengthComputable) {
            let percent = Math.round((e.loaded / e.total) * 100);
            setProgress(Math.round((percent * 90) / 100) + '%');
            // console.log(e.loaded + ' ' + e.total);
          }
        },
      });

      if (res.status === 100) {
        toast(upload[language].choose_video);
        setProgress(null);
        setStatus(null);
        setIsUploading(false);
        return;
      }

      if (res.status === 1) {
        setStatus(upload[language].success);
        setGuid(res.guid);
        setShortId(res.video.short_id);
      }

      if (res.status === 0) {
        setStatus(upload[language].error);
      }
    },
    [IsUploading, upload, language]
  );

  useEffect(() => {
    const handleVideoStatus = ({ status, guid }) => {
      if (guid !== Guid) return;
      switch (status) {
        case 1:
          setStatus(upload[language].processing);
          document.title = upload[language].processing;
          setProgress('91%');
          break;
        case 2:
          setStatus(upload[language].encoding);
          document.title = upload[language].encoding;
          setProgress('95%');
          break;
        case 4:
          setStatus(upload[language].video99);
          document.title = upload[language].video99;
          setProgress('99%');
          setIsUploading(false);
          setStatusCode(4);
          break;
        case 3:
          setStatus(upload[language].video100);
          document.title = upload[language].video100;
          setProgress('100%');
          break;
        case 5:
          setStatus(upload[language].error);
          //xu ly loi
          document.title = upload[language].error;
          break;
        default:
          break;
      }
    };
    socket.on('video_status', handleVideoStatus);

    return () => {
      socket.removeListener('video_status', handleVideoStatus);
    };
  }, [Guid, upload, language]);

  return (
    <div className='upload'>
      <form onSubmit={handleUpload} className='upload__form'>
        <div className='upload__title upload__title--left'>
          <p>{upload[language].upload}</p>
        </div>

        {Status && (
          <>
            <div style={{ '--progress': Progress }} className='upload__progress-bar mt-30'>
              <span>
                <span>{Progress}</span>
              </span>
            </div>
            <div
              onClick={() => {
                StatusCode === 4 && history.push('/watch?v=' + ShortId);
              }}
              className='upload__status'
              style={
                Progress === '99%' || Progress === '100%'
                  ? { cursor: 'pointer', textDecoration: 'underline' }
                  : {}
              }
            >
              {Status}
            </div>
          </>
        )}

        <div className='upload__form-inputBox mt-20'>
          <label className='upload__form-label' htmlFor='upload__form-name'>
            {upload[language].title}
          </label>
          <input
            id='upload__form-name'
            name='name'
            type='text'
            placeholder={upload[language].placeholder_title}
            value={VideoTitle}
            onChange={e => setVideoTitle(e.target.value)}
          />
        </div>

        <div className='upload__form-textareaBox mt-20'>
          <label className='upload__form-label' htmlFor='upload__form-desc'>
            {upload[language].desc}
          </label>
          <textarea
            id='upload__form-desc'
            name='description'
            placeholder={upload[language].placeholder_desc}
            value={VideoDesc}
            onChange={e => setVideoDesc(e.target.value)}
          ></textarea>
        </div>

        <div className='upload__form-inputBox mt-20'>
          <label className='upload__form-label' htmlFor='upload__form-tags'>
            {upload[language].tags}
          </label>
          <input
            id='upload__form-tags'
            name='tags'
            type='text'
            placeholder={upload[language].placeholder_tags}
            value={VideoTag}
            onChange={e => setVideoTag(e.target.value)}
          />
        </div>

        <div className='mt-20'>
          <div className='upload__form-label'>Video</div>
          <label htmlFor='inputfile' className='upload__form-thumbnailBox mt-30'>
            <input accept=".mp4,.mkv,.webm,.flv,.vod,.avi,.mov,.wmv,.amv,.m4p,.mpeg,.mpg,.4mv" name='video' onChange={readURL} id='inputfile' type='file' />
            <GoIcon.GoCloudUpload className='icon' />
            {VideoSrc && <video autoPlay muted src={VideoSrc}></video>}
          </label>
        </div>

        <div className='mt-50' style={{ textAlign: 'right' }}>
          <div
            style={{
              display: width > BREAK_POINT_EXTRA_EXTRA_SMALL ? 'inline-block' : 'block',
              position: 'relative',
            }}
          >
            <button
              type='submit'
              className={`button-new-new ${IsUploading ? 'disabled' : ''}`}
              style={{ width: width > BREAK_POINT_EXTRA_EXTRA_SMALL ? 'auto' : '100%' }}
            >
              {IsUploading ? upload[language].uploading : upload[language].upload}
            </button>
            <span className='disabled'></span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Upload;
