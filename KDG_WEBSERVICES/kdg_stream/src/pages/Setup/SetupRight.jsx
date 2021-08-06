import PropTypes from 'prop-types';
import React, { useState } from 'react';
import * as GoIcon from 'react-icons/go';
import * as MdIcon from 'react-icons/md';
import * as RiIcon from 'react-icons/ri';
import * as IoIcon from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import { Tab, TabPane } from '../../components';
import { RTMP_DOMAIN, STORAGE_DOMAIN } from '../../constant';
import { useLanguage } from '../../context/LanguageLayer';

const SetupRight = props => {
  const { Stream, readURL, handlePublicStream, handleStopStream, CopyToClipboard } = props;

  const history = useHistory();
  const [{ language, setup }] = useLanguage();
  const [isHideStreamKey, setIsHideStreamKey] = useState(false);

  return (
    <>
      <Tab>
        <TabPane name={setup[language].connect} key='1'>
          <div className='setup__tabConnect'>
            <div className='setup__tabConnect-title'>{setup[language].connect_title}</div>
            <div className='setup__tabConnect-desc'>{setup[language].connect_desc}</div>

            <div style={{ textAlign: 'right' }}>
              <div
                className='setup__tabConnect-hidecode'
                onClick={() => setIsHideStreamKey(x => !x)}
              >
                {isHideStreamKey && (
                  <>
                    <IoIcon.IoIosEye className='icon' />
                    <span>{setup[language].show}</span>
                  </>
                )}
                {!isHideStreamKey && (
                  <>
                    <IoIcon.IoIosEyeOff className='icon' />
                    <span>{setup[language].hide}</span>
                  </>
                )}
              </div>
            </div>

            <div className='setup__tabConnect-info'>
              <div className='setup__tabConnect-info-label'>Server URL</div>
              <div className='setup__tabConnect-info-key'>
                {Stream?.key && (
                  <>
                    <p>{isHideStreamKey ? '*****' : RTMP_DOMAIN}</p>
                    <div
                      className='setup__tabConnect-info-button'
                      onClick={() => CopyToClipboard(RTMP_DOMAIN)}
                    >
                      <MdIcon.MdContentCopy className='icon' />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className='setup__tabConnect-info'>
              <div className='setup__tabConnect-info-label'>Stream Key</div>
              <div className='setup__tabConnect-info-key'>
                {Stream?.key && (
                  <>
                    <p>{isHideStreamKey ? '*****' : Stream?.key}</p>
                    <div
                      className='setup__tabConnect-info-button'
                      onClick={() => CopyToClipboard(Stream?.key)}
                    >
                      <MdIcon.MdContentCopy className='icon' />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className='setup__tabConnect-warning'>
              <div className='setup__tabConnect-warning-iconBox'>
                <RiIcon.RiErrorWarningFill className='icon' />
              </div>
              <div
                className='setup__tabConnect-warning-text'
                dangerouslySetInnerHTML={{ __html: setup[language].warning }}
              ></div>
            </div>

            <div className='setup__tabSetup-action mt-20'>
              {Stream.status === 1 && Stream.connect_status === 0 && (
                <>
                  <p className='setup__tabSetup-noti mb-10'>{setup[language].noti3}</p>
                  <button type='button' className='button-new-new' onClick={handleStopStream}>
                    {setup[language].end}
                  </button>
                </>
              )}
            </div>
          </div>
        </TabPane>

        <TabPane name={setup[language].setup} key='2'>
          <form onSubmit={handlePublicStream} className='setup__tabSetup'>
            {Stream.status === 0 && (
              <>
                <div className='setup__tabSetup-inputBox'>
                  <label
                    htmlFor='setup__tabSetup-inputBox-name'
                    className='setup__tabSetup-inputBox-label'
                  >
                    {setup[language].title}
                  </label>
                  <input
                    id='setup__tabSetup-inputBox-name'
                    name='name'
                    placeholder={setup[language].setup_title}
                  />
                </div>

                <div className='setup__tabSetup-textareaBox'>
                  <label
                    htmlFor='setup__tabSetup-textareaBox-desc'
                    className='setup__tabSetup-inputBox-label'
                  >
                    {setup[language].desc}
                  </label>
                  <textarea
                    id='setup__tabSetup-textareaBox-desc'
                    name='description'
                    placeholder={setup[language].setup_desc}
                  ></textarea>
                </div>

                <div className='setup__tabSetup-inputBox'>
                  <label
                    htmlFor='setup__tabSetup-inputBox-tags'
                    className='setup__tabSetup-inputBox-label'
                  >
                    {setup[language].tags}
                  </label>
                  <input
                    id='setup__tabSetup-inputBox-tags'
                    type='text'
                    name='tags'
                    placeholder={setup[language].setup_tag}
                  />
                </div>

                <div>
                  <label className='setup__tabSetup-inputBox-label'>Thumbnail</label>

                  <div className='setup__tabSetup-note'>
                    <p>{setup[language].note}</p>
                    <p>{setup[language].note1}</p>
                    <p>{setup[language].note2}</p>
                  </div>

                  <div className='setup__tabSetup-thumbnailBox'>
                    <input type='file' accept=".png,.jpg,.jpeg" name='thumbnail' onChange={readURL} />
                    <img
                      src={STORAGE_DOMAIN + Stream?.thumbnail?.path}
                      className={`${Stream?.thumbnail?.path ? 'show' : ''}`}
                      alt=''
                    />
                    <GoIcon.GoCloudUpload className='icon' />
                    <p>{setup[language].thumb1}</p>
                    <p>{setup[language].thumb2}</p>
                  </div>
                </div>
              </>
            )}

            <div className='setup__tabSetup-action mt-20 mb-90'>
              {Stream.status === 1 && (
                <button
                  className='button-new-new'
                  onClick={() => history.push('/live?s=' + Stream._id)}
                >
                  {setup[language].watch}
                </button>
              )}

              {Stream.status === 0 && Stream.connect_status === 0 && (
                <p className='setup__tabSetup-noti'>{setup[language].noti1}</p>
              )}

              {Stream.status === 0 && Stream.connect_status === 1 && (
                <button type='submit' className='button-new-new'>
                  {setup[language].start}
                </button>
              )}

              {Stream.status === 1 && Stream.connect_status === 1 && (
                <p className='setup__tabSetup-noti mb-10 mt-10'>{setup[language].noti2}</p>
              )}

              {Stream.status === 1 && Stream.connect_status === 0 && (
                <>
                  <p className='setup__tabSetup-noti mb-10 mt-10'>{setup[language].noti3}</p>
                  <button type='button' className='button-new-new' onClick={handleStopStream}>
                    {setup[language].end}
                  </button>
                </>
              )}
            </div>
          </form>
        </TabPane>
      </Tab>
    </>
  );
};

SetupRight.propTypes = {
  Stream: PropTypes.object.isRequired,
  readURL: PropTypes.func.isRequired,
  handlePublicStream: PropTypes.func.isRequired,
  handleStopStream: PropTypes.func.isRequired,
  CopyToClipboard: PropTypes.func.isRequired,
};

export default SetupRight;
