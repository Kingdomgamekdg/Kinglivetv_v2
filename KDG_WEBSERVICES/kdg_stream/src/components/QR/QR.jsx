import QRCode from 'qrcode';
import React, { useCallback, useMemo, useState } from 'react';
import * as GrIcon from 'react-icons/gr';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import '../../assets/css/qr.css';
// import kdgCoin from '../../assets/images/kdg-coin.svg';
import copyIcon from '../../assets/images/copy.svg';
import { useLanguage } from '../../context/LanguageLayer';

const QR = props => {
  const [QR_SECRET, setQR_SECRET] = useState(null);
  const { onCancel = () => {} } = props;

  const [{ language, qr }] = useLanguage();
  const addressKDG = useSelector(state => state.addressKDG);

  useMemo(async () => {
    const qr = await QRCode.toDataURL(addressKDG);
    setQR_SECRET(qr);
  }, [addressKDG]);

  const CopyToClipboard = useCallback(
    value => {
      var input = document.createElement('input');
      document.querySelector('body').append(input);
      input.value = value;
      input.select();
      document.execCommand('copy');
      input.remove();
      toast(qr[language].copied);
    },
    [qr, language]
  );

  return (
    <div className='QR'>
      <div className='QR__close' onClick={() => onCancel(false)}>
        <GrIcon.GrFormClose />
      </div>
      <div className='QR__header'>{qr[language].deposit}</div>
      <div className='QR__body'>
        <p>{qr[language].scan_here}</p>
        <div className='QR__frame'>
          <div className='QR__frame-top-left'></div>
          <div className='QR__frame-top-right'></div>
          <div className='QR__frame-bottom-left'></div>
          <div className='QR__frame-bottom-right'></div>
          <img src={QR_SECRET} alt='QR Code' />
          {/* <img src={kdgCoin} alt='coin' /> */}
        </div>
        <p>{qr[language].or_copy}</p>
        <div className='QR__wallet' onClick={() => CopyToClipboard(addressKDG)}>
          <span>{addressKDG}</span>
          <img src={copyIcon} alt='icon' />
        </div>
      </div>
    </div>
  );
};

export default QR;
