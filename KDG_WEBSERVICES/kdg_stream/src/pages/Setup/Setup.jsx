import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import '../../assets/css/setup.css';
import callAPI from '../../axios';
import { useLanguage } from '../../context/LanguageLayer';
import { Main } from '../../layout';
import socket from '../../socket';
import SetupLeft from './SetupLeft';
import SetupRight from './SetupRight';

const Setup = () => {
  const history = useHistory();
  const [Stream, setStream] = useState({});
  const [{ language, setup }] = useLanguage();

  const CopyToClipboard = useCallback(
    ref => {
      var input = document.createElement('input');
      document.querySelector('body').append(input);
      input.value = ref;
      input.select();
      document.execCommand('copy');
      input.remove();
      toast(setup[language].copied);
    },
    [setup, language]
  );

  const readURL = useCallback(input => {
    input.persist();
    input = input.target;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = async function (e) {
        let buffer = e.target.result;
        let videoBlob = new Blob([new Uint8Array(buffer)]);
        let url = window.URL.createObjectURL(videoBlob);
        input.nextElementSibling.setAttribute('src', url);
        input.nextElementSibling.style.display = 'inline';
      };
      reader.readAsArrayBuffer(input.files[0]);
    }
  }, []);

  useEffect(() => {
    document.title = 'Kinglive TV';
    callAPI.get('/stream').then(res => {
      setStream(res.data);
    });

    const handleStream = data => setStream(data);
    socket.on('stream', handleStream);

    return () => {
      socket.removeEventListener('stream', handleStream);
    };
  }, []);

  const handlePublicStream = useCallback(
    async e => {
      e.preventDefault();

      const formData = new FormData(e.target);

      try {
        const res = await callAPI.post('/public_stream?sid=' + Stream._id, formData);

        if (res.status === 100) {
          toast(setup[language].choose_thumbnail);
          return;
        }

        toast(setup[language].public_stream);
      } catch (error) {
        console.log({ error });
        toast(setup[language].fail);
      }
    },
    [Stream, setup, language]
  );

  const handleStopStream = useCallback(async () => {
    try {
      await callAPI.post('/stop_stream?sid=' + Stream._id);

      toast(setup[language].stop_stream);
      history.push('/');
    } catch (error) {
      console.log({ error });
      toast(setup[language].fail);
    }
  }, [history, Stream, setup, language]);

  return (
    <>
      <Main
        className='setup'
        left={<SetupLeft Stream={Stream} />}
        right={
          <SetupRight
            Stream={Stream}
            readURL={readURL}
            handlePublicStream={handlePublicStream}
            handleStopStream={handleStopStream}
            CopyToClipboard={CopyToClipboard}
          />
        }
        widthLeft='68%'
        minWidthLeftLarge='450px'
      />
    </>
  );
};

export default Setup;
