import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { message } from 'antd';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import callAPI from '../../axios';
import { useLang } from '../../context/LanguageLayer';
import { actChangeLoading } from '../../store/action';

export default function Tab2() {
    const [{ language, AccountPageLanguage }] = useLang();
    // const dispatch = useDispatch();
    // const [ListReward, setListReward] = useState([]);
    const user = useSelector(state => state.user);
    // const kdg_reward = useSelector(state => state && state.user && state.user.kdg_reward);

    const handleCopy = useCallback(
        e => {
            var input = document.createElement('input');
            document.querySelector('body').append(input);
            input.value = e.target.innerText;
            input.select();
            document.execCommand('copy');
            input.remove();
            message.success(AccountPageLanguage[language].copied);
        },
        [AccountPageLanguage, language]
    );

    // const handleGetHistory = useCallback(async () => {
    //     try {
    //         dispatch(actChangeLoading(true));
    //         const res = await callAPI.get(`/get_transaction?id=${user._id}&skip=0&take=9999999&type=kyc-success`);
    //         dispatch(actChangeLoading(false));

    //         setListReward([...res.data]);
    //         document.querySelector('.maskreward').classList.add('show');
    //     } catch (error) {
    //         dispatch(actChangeLoading(false));
    //     }
    // }, [dispatch, user]);

    return (
        <>
            {/* <div onClick={e => e.target.classList.remove('show')} className='maskreward'>
                <div className='popupreward'>
                    <div className='header'>
                        <p>{AccountPageLanguage[language].rewarded}</p>
                    </div>
                    <div className='body'>
                        <div className='count-info'>
                            <div className='count'>
                                <p>{AccountPageLanguage[language].kyc_success_number}</p>
                                <p className='number'>{ListReward.length}</p>
                            </div>
                        </div>
                        <p className='title'>{AccountPageLanguage[language].rewarded_list}</p>
                        <div className='list-detail'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>{AccountPageLanguage[language].date}</th>
                                        <th>{AccountPageLanguage[language].from}</th>
                                        <th>{AccountPageLanguage[language].status}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ListReward.length > 0 ? (
                                        ListReward.map(o => {
                                            var d = new Date(o.create_date);
                                            return (
                                                o.from && (
                                                    <tr>
                                                        <td>
                                                            <span>
                                                                {d.getHours()}:{d.getMinutes()}
                                                            </span>{' '}
                                                            <br></br>{' '}
                                                            <span>
                                                                {d.getDate()}/{d.getMonth() + 1}/{d.getFullYear()}
                                                            </span>{' '}
                                                        </td>
                                                        <td>{o.from.email}</td>
                                                        <td>{AccountPageLanguage[language].kyc_success}</td>
                                                    </tr>
                                                )
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan='2'>{AccountPageLanguage[language].nodata}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* <div className='ref'>
                <h3>{AccountPageLanguage[language].referral}</h3>
                <p onClick={handleGetHistory} className='open-reward'>
                    {AccountPageLanguage[language].rewarded}
                </p>
            </div> */}
            <div className='ref'>
                {/* <div>
                    <span>{AccountPageLanguage[language].current_reward_points}</span>
                    <span className='high-line'>{kdg_reward} KDG Reward</span>
                </div> */}
                <div>
                    <span>{AccountPageLanguage[language].referral_link}</span>
                    <span className='link' onClick={handleCopy}>
                        https://www.kingdomgame.org/reg/{user && user.ref_code}
                        <FontAwesomeIcon style={{ pointerEvents: 'none' }} icon={faCopy} />
                    </span>
                </div>
                <div>
                    <span>{AccountPageLanguage[language].referral_code}</span>
                    <span className='code' onClick={handleCopy}>
                        {user && user.ref_code}
                        <FontAwesomeIcon style={{ pointerEvents: 'none' }} icon={faCopy} />
                    </span>
                </div>
            </div>
            {/* <div className='rule'>
                <p>{AccountPageLanguage[language].rules}</p>
                <p>{AccountPageLanguage[language].rules_1}</p>
                <p>{AccountPageLanguage[language].rules_2}</p>
                <p>{AccountPageLanguage[language].rules_3}</p>
                <p>{AccountPageLanguage[language].rules_4}</p>
            </div> */}
        </>
    );
}
