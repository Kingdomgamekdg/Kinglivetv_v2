import { useCallback, useMemo, useState } from 'react';
import '../../assets/css/profile.css';
import callAPI from '../../axios';
import { STORAGE_DOMAIN } from '../../constant';
import { useDispatch, useSelector } from 'react-redux';
import { actChangeUploadStatus } from '../../store/action';

export default function ListImages() {
  const dispatch = useDispatch();
  const uploadStatus = useSelector(state => state.uploadStatus);
  const [Avatars, setAvatars] = useState([]);

  const getAvatar = useCallback(async () => {
    const res = await callAPI.get('/avatar');
    setAvatars(res.data);
  }, []);

  useMemo(() => {
    getAvatar();
  }, [getAvatar]);

  const handleOpenCrop = useCallback(
    (image, _id) => {
      dispatch(
        actChangeUploadStatus({
          ...uploadStatus,
          isShowCrop: true,
          image,
          _id,
        })
      );
    },
    [uploadStatus, dispatch]
  );

  return (
    <div className='kdg-row kdg-column-3 mt-30 mb-10' style={{ maxHeight: '400px' }}>
      {Avatars.map(o => (
        <div
          key={o._id}
          className='item'
          onClick={() => handleOpenCrop(STORAGE_DOMAIN + o.path, o._id)}
        >
          <div className='img img-1-1'>
            <img src={STORAGE_DOMAIN + o.path} alt='' />
          </div>
        </div>
      ))}
    </div>
  );
}
