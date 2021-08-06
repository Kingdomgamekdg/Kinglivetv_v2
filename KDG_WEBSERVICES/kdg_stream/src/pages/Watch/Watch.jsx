import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../assets/css/watch.css';
import callAPI from '../../axios';
import { Recommend, VideoInfo } from '../../components';

const Watch = () => {
  const id = new URLSearchParams(useLocation().search).get('v');

  const [video, setVideo] = useState(null);

  useMemo(() => {
    if (id) {
      callAPI.get('/video?sid=' + id).then(res => {
        document.title = res.data.name;
        setVideo(res.data);
      });
    }
  }, [id]);

  return (
    <div className='watch'>
      <div className='watch__left'>
        {video && (
          <div className='watch__videoBox'>
            <iframe
              title='video'
              loading='lazy'
              allowFullScreen={true}
              src={`https://iframe.mediadelivery.net/embed/1536/${video?.guid}?autoplay=true`}
              allow='accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;'
            ></iframe>
          </div>
        )}

        <VideoInfo id={id} />
      </div>

      <div className='watch__right'>
        <Recommend id={id} />
      </div>
    </div>
  );
};

export default Watch;
