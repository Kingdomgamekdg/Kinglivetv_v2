import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { message } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import backid from '../../assets/img/backid.png';
import flag from '../../assets/img/flag.png';
import frontid from '../../assets/img/frontid.png';
import idCard from '../../assets/img/idcard.png';
import self from '../../assets/img/self.png';
import selfleft from '../../assets/img/selfleft.png';
import selfright from '../../assets/img/selfright.png';
import selfup from '../../assets/img/selfup.png';
import callapi from '../../axios';
import { useLang } from '../../context/LanguageLayer';
import { actChangeLoading, asyncGetListContries } from '../../store/action';

export default function Tab3() {
  const [{ language, Tab3PageLanguage }] = useLang();
  const dispatch = useDispatch();
  const listContries = useSelector(state => state.contries);
  const kyc_state = useSelector(state => state.user?.kyc);
  const [SelectedID, setSelectedID] = useState(0);
  const [SelectedContry, setSelectedContry] = useState('VN');
  const [ListContry, setListContry] = useState(null);
  const [ListContrySearch, setListContrySearch] = useState();

  const [ValidateForm, setValidateForm] = useState({
    name: false,
    id: false,
    img1: false,
    img2: false,
    img3: false,
    img4: false,
    img5: false,
    img6: false,
    check: false,
  });

  const email = useSelector(state => state.user && state.user.email);

  const findValueContry = useCallback(() => {
    return listContries ? listContries.find(o => SelectedContry === o.alpha2Code) : {};
  }, [SelectedContry, listContries]);

  const idtype = useMemo(() => {
    return [
      {
        value: 0,
        name: Tab3PageLanguage[language].ID,
      },
      {
        value: 1,
        name: Tab3PageLanguage[language].passport,
      },
    ];
  }, [Tab3PageLanguage, language]);

  useEffect(() => {
    if (listContries) {
      setListContry([...listContries]);
    }
  }, [listContries]);

  useEffect(() => {
    setListContrySearch(findValueContry().name ? findValueContry().name : 'Viet Nam');
  }, [SelectedContry, findValueContry]);

  const findValueID = useCallback(() => {
    return idtype.find(o => SelectedID === o.value).name;
  }, [SelectedID, idtype]);

  useEffect(() => {
    const selectBlock = document.querySelectorAll('.type .selected');
    selectBlock.forEach(el => {
      el.addEventListener('click', e => {
        if (Array.from(el.classList).includes('show')) el.classList.remove('show');
        else el.classList.add('show');
      });
    });
  }, []);

  useMemo(() => {
    dispatch(asyncGetListContries());
  }, [dispatch]);

  const readURL = useCallback(
    input => {
      input.persist();
      input = input.target;
      if (input.files && input.files[0]) {
        if (input.files[0].size > 2000000) {
          message.error(Tab3PageLanguage[language].file_size_exceeds_2MB);
        } else {
          var reader = new FileReader();
          reader.onload = function (e) {
            var label = input.nextElementSibling;
            label.querySelector('img.placeholder').setAttribute('src', e.target.result);
          };
          reader.readAsDataURL(input.files[0]);
        }
      }
    },
    [Tab3PageLanguage, language]
  );

  const userId = useSelector(state => state && state.user && state.user._id);

  const handleSubmitForm = useCallback(
    async e => {
      e.preventDefault();
      const data = new FormData(e.target);
      var submitData = {};
      for (var pair of data.entries()) {
        submitData[pair[0]] = pair[1];
      }

      const arrayUpload = [];
      const uploadFont = new FormData();
      uploadFont.append('file', submitData.font);
      uploadFont.append('userId', userId);
      arrayUpload.push(callapi.post('/upload_kyc_image', uploadFont));

      const uploadSelf = new FormData();
      uploadSelf.append('file', submitData.self);
      uploadSelf.append('userId', userId);
      arrayUpload.push(callapi.post('/upload_kyc_image', uploadSelf));

      const uploadSelfLeft = new FormData();
      uploadSelfLeft.append('file', submitData.selfleft);
      uploadSelfLeft.append('userId', userId);
      arrayUpload.push(callapi.post('/upload_kyc_image', uploadSelfLeft));

      const uploadSelfRight = new FormData();
      uploadSelfRight.append('file', submitData.selfright);
      uploadSelfRight.append('userId', userId);
      arrayUpload.push(callapi.post('/upload_kyc_image', uploadSelfRight));

      const uploadSelfUp = new FormData();
      uploadSelfUp.append('file', submitData.selfup);
      uploadSelfUp.append('userId', userId);
      arrayUpload.push(callapi.post('/upload_kyc_image', uploadSelfUp));

      if (SelectedID === 0) {
        const uploadBack = new FormData();
        uploadBack.append('file', submitData.back);
        uploadBack.append('userId', userId);
        arrayUpload.push(callapi.post('/upload_kyc_image', uploadBack));
      }

      try {
        dispatch(actChangeLoading(true));
        var res = await Promise.all(arrayUpload);
        dispatch(actChangeLoading(false));

        var isUploadOK = true;
        res.forEach(el => {
          if (el.status !== 1) isUploadOK = false;
        });

        if (!isUploadOK) {
          message.error(Tab3PageLanguage[language].img_upload_error);
          return;
        } else {
          var kycInfo = {
            country: SelectedContry,
            id: submitData.id,
            first_name: submitData.name,
            id: userId,
          };
          dispatch(actChangeLoading(true));
          const resUpdate = await callapi.put(`/kyc`, kycInfo);
          dispatch(actChangeLoading(false));

          if (resUpdate.status === 1) {
            message.success(Tab3PageLanguage[language].resUpdate_success);
          }
          if (resUpdate.status === 100) {
            message.error(Tab3PageLanguage[language].resUpdate_error_100);
          }
        }
      } catch (error) {
        dispatch(actChangeLoading(false));
        message.error(Tab3PageLanguage[language].img_upload_error);
      }
    },
    [SelectedID, SelectedContry, userId, dispatch, Tab3PageLanguage, language]
  );

  return (
    <>
      <form onSubmit={handleSubmitForm}>
        <div className='input-group haft select'>
          <p className='title'>{Tab3PageLanguage[language].document_type}</p>
          <div className='select-block type'>
            <img alt='' src={idCard} />
            <div className='selected'>
              <span>
                <span>{findValueID()}</span> <FontAwesomeIcon icon={faCaretDown} />
              </span>
              <div className='dropdown-selected'>
                {idtype.map((el, idx) => (
                  <p
                    onClick={() => setSelectedID(idx)}
                    className={SelectedID === idx ? 'selected-value' : ''}
                    key={idx}
                  >
                    {el.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className='input-group haft select'>
          <p className='title'>{Tab3PageLanguage[language].nation}</p>
          <div className='select-block'>
            <img style={{ width: 27 }} alt='' src={flag} />
            <div className='selected'>
              <span className='contry'>
                <img className='flag' alt='' src={listContries && findValueContry().flag} />
                <input
                  autocomplete='off'
                  id='defaultvalue'
                  onFocus={e => {
                    setListContrySearch('');
                    e.target.parentElement.parentElement.classList.add('show');
                  }}
                  onChange={e => {
                    setListContrySearch(e.target.value);
                    var value = e.target.value.toLowerCase();
                    if (value !== '') {
                      ListContry.length = 0;
                      listContries.forEach(el => {
                        if (el.name.toLowerCase().includes(value)) {
                          ListContry.push(el);
                        }
                      });
                      setListContry([...ListContry]);
                    }
                    if (value === '') {
                      setListContry([...listContries]);
                    }
                  }}
                  value={ListContrySearch}
                />
                <FontAwesomeIcon icon={faCaretDown} />
              </span>
              <div className='dropdown-selected'>
                {ListContry &&
                  ListContry.map((el, idx) => (
                    <p
                      onClick={e => {
                        setSelectedContry(el.alpha2Code);
                        setListContrySearch(findValueContry().name);
                        e.target.parentElement.parentElement.classList.remove('show');
                      }}
                      className={SelectedContry === el.alpha2Code ? 'selected-value' : ''}
                      key={idx}
                    >
                      <img className='flag' alt='' src={el.flag} />
                      {el.name}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className='input-group'>
          <span>{Tab3PageLanguage[language].name}</span>
          <input
            onChange={e =>
              e.target.value !== ''
                ? setValidateForm({ ...ValidateForm, name: true })
                : setValidateForm({ ...ValidateForm, name: false })
            }
            name='name'
            placeholder={Tab3PageLanguage[language].exactly_name}
          />
        </div>
        <div className='input-group'>
          <span> {findValueID()} </span>
          <input
            onChange={e =>
              e.target.value !== ''
                ? setValidateForm({ ...ValidateForm, id: true })
                : setValidateForm({ ...ValidateForm, id: false })
            }
            name='id'
            placeholder={Tab3PageLanguage[language].so + findValueID()}
          />
        </div>
        <div className='input-group'>
          <span>Email</span>
          <input disabled defaultValue={email} name='email' placeholder='Email' />
        </div>
        <ul>
          <li>{Tab3PageLanguage[language].desc_1}</li>
          <li>{Tab3PageLanguage[language].desc_2}</li>
        </ul>
        <div className='upload'>
          <div className='text'>
            {SelectedID === 0 ? Tab3PageLanguage[language].front_ID : Tab3PageLanguage[language].passport_image}
          </div>
          <input
            onChange={e => {
              readURL(e);
              e.target.files && e.target.files[0]
                ? setValidateForm({ ...ValidateForm, img1: true })
                : setValidateForm({ ...ValidateForm, img1: false });
            }}
            type='file'
            accept='image/*'
            name='font'
            id='font'
            style={{ display: 'none' }}
          />
          <label htmlFor='font' className='upload-block'>
            <img alt='' src={frontid} />
            <img alt='' src='' className='placeholder' />
            <p>{Tab3PageLanguage[language].click_upload_front}</p>
          </label>
        </div>

        {SelectedID === 0 && (
          <div className='upload'>
            <div className='text'>{Tab3PageLanguage[language].back_ID}</div>
            <input
              onChange={e => {
                readURL(e);
                e.target.files && e.target.files[0]
                  ? setValidateForm({ ...ValidateForm, img2: true })
                  : setValidateForm({ ...ValidateForm, img2: false });
              }}
              type='file'
              accept='image/*'
              id='back'
              name='back'
              style={{ display: 'none' }}
            />
            <label htmlFor='back' className='upload-block'>
              <img alt='' src={backid} />
              <img alt='' src='' className='placeholder' />
              <p>{Tab3PageLanguage[language].click_upload_back}</p>
            </label>
          </div>
        )}

        <div className='upload'>
          <div className='text'>
            {SelectedID === 0 ? '3' : '2'}
            {Tab3PageLanguage[language].text_1}
          </div>
          <input
            onChange={e => {
              readURL(e);
              e.target.files && e.target.files[0]
                ? setValidateForm({ ...ValidateForm, img3: true })
                : setValidateForm({ ...ValidateForm, img3: false });
            }}
            type='file'
            accept='image/*'
            id='self'
            name='self'
            style={{ display: 'none' }}
          />
          <label htmlFor='self' className='upload-block'>
            <img alt='' src={self} />
            <img alt='' src='' className='placeholder' />
            <p>{Tab3PageLanguage[language].click_upload}</p>
          </label>
        </div>

        <div className='upload'>
          <div className='text'>
            {SelectedID === 0 ? '4' : '3'}
            {Tab3PageLanguage[language].text_2}
          </div>
          <input
            onChange={e => {
              readURL(e);
              e.target.files && e.target.files[0]
                ? setValidateForm({ ...ValidateForm, img4: true })
                : setValidateForm({ ...ValidateForm, img4: false });
            }}
            type='file'
            accept='image/*'
            id='selfleft'
            name='selfleft'
            style={{ display: 'none' }}
          />
          <label htmlFor='selfleft' className='upload-block'>
            <img alt='' src={selfleft} />
            <img alt='' src='' className='placeholder' />
            <p>{Tab3PageLanguage[language].click_upload}</p>
          </label>
        </div>

        <div className='upload'>
          <div className='text'>
            {SelectedID === 0 ? '5' : '4'}
            {Tab3PageLanguage[language].text_3}
          </div>
          <input
            onChange={e => {
              readURL(e);
              e.target.files && e.target.files[0]
                ? setValidateForm({ ...ValidateForm, img5: true })
                : setValidateForm({ ...ValidateForm, img5: false });
            }}
            type='file'
            accept='image/*'
            id='selfright'
            name='selfright'
            style={{ display: 'none' }}
          />
          <label htmlFor='selfright' className='upload-block'>
            <img alt='' src={selfright} />
            <img alt='' src='' className='placeholder' />
            <p>{Tab3PageLanguage[language].click_upload}</p>
          </label>
        </div>

        <div className='upload'>
          <div className='text'>
            {SelectedID === 0 ? '6' : '5'}
            {Tab3PageLanguage[language].text_4}
          </div>
          <input
            onChange={e => {
              readURL(e);
              e.target.files && e.target.files[0]
                ? setValidateForm({ ...ValidateForm, img6: true })
                : setValidateForm({ ...ValidateForm, img6: false });
            }}
            type='file'
            accept='image/*'
            id='selfup'
            name='selfup'
            style={{ display: 'none' }}
          />
          <label htmlFor='selfup' className='upload-block'>
            <img alt='' src={selfup} />
            <img alt='' src='' className='placeholder' />
            <p>{Tab3PageLanguage[language].click_upload}</p>
          </label>
        </div>

        <div className='input-group checkbox'>
          <input
            className='checkbox'
            onChange={e => setValidateForm({ ...ValidateForm, check: e.target.checked })}
            type='checkbox'
            name='confirm'
            id='confirm'
          />
          <label className='checkbox-label' for='confirm'>
            <span className='checkbox-box'></span> <span>{Tab3PageLanguage[language].confirm_upload}</span>
          </label>
        </div>

        <div className='input-group'>
          <button
            type='submit'
            style={
              kyc_state?.status !== 1 && kyc_state?.status !== 2
                ? SelectedID === 0
                  ? (ValidateForm.check &&
                      ValidateForm.id &&
                      ValidateForm.name &&
                      ValidateForm.img1 &&
                      ValidateForm.img2 &&
                      ValidateForm.img3,
                    ValidateForm.img4,
                    ValidateForm.img5,
                    ValidateForm.img6)
                    ? { opacity: 1, pointerEvents: 'all' }
                    : { opacity: 0.6, pointerEvents: 'none' }
                  : (ValidateForm.check &&
                      ValidateForm.id &&
                      ValidateForm.name &&
                      ValidateForm.img1 &&
                      ValidateForm.img3,
                    ValidateForm.img4,
                    ValidateForm.img5,
                    ValidateForm.img6)
                  ? { opacity: 1, pointerEvents: 'all' }
                  : { opacity: 0.6, pointerEvents: 'none' }
                : { opacity: 0.6, pointerEvents: 'none' }
            }
          >
            {Tab3PageLanguage[language].xac_nhan}
          </button>
        </div>
      </form>
    </>
  );
}
