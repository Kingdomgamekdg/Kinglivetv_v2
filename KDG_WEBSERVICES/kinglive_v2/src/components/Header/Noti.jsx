import { useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import callAPI from "../../axios"
import { actChangeUnreadNoti, asyncGetNoti } from "../../store/actions"
import logo from '../../assets/images/header/logo.svg'
import convertDateAgo from '../../helpers/convertDateAgo'

export default function Noti() {
    const unread = useSelector(state => state.unread_noti)
    const noties = useSelector(state => state.noties)
    const dispatch = useDispatch()
    const [IsOpenNoti, setIsOpenNoti] = useState(false)
    const handleOpenNoti = useCallback(async () => {
        setIsOpenNoti(!IsOpenNoti)
        dispatch(asyncGetNoti())
        await callAPI.post('/readed')
        dispatch(actChangeUnreadNoti(0))
    }, [IsOpenNoti])
    return (
        <>
            <div onClick={handleOpenNoti} className='noti'>
                <span>{unread}</span>
                <svg
                    width='18'
                    height='21'
                    viewBox='0 0 18 21'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        d='M10.6014 3.21623V3.58866L10.9583 3.6953C13.2008 4.36543 14.8389 6.44431 14.8389 8.89865V11.0233C14.8389 12.4191 15.2186 13.7903 15.9374 14.9876L17.323 17.2973H1.49018L2.87643 14.9866L2.87651 14.9865C3.59423 13.7894 3.974 12.4191 3.974 11.0233V8.89865C3.974 6.44431 5.61206 4.36543 7.85459 3.69529L8.21143 3.58866V3.21623V1.69499C8.21143 1.03634 8.74777 0.5 9.40642 0.5C10.0651 0.5 10.6014 1.03634 10.6014 1.69499V3.21623ZM1.42131 17.4122L1.42145 17.4119C1.4214 17.412 1.42135 17.4121 1.4213 17.4122L1.3561 17.373L1.42131 17.4122Z'
                        stroke='#C4C4C4'
                    />
                    <path
                        d='M9.407 19.8399C8.74596 19.8399 8.14589 19.5753 7.70334 19.1449H11.1107C10.6681 19.5753 10.068 19.8399 9.407 19.8399Z'
                        stroke='#C4C4C4'
                    />
                </svg>
                <div className={`dropdown ${IsOpenNoti ? 'show' : ''}`}>
                    <p>Notification</p>
                    {noties?.map(o => <div
                        className='item'>
                        <span className='avatar'>
                            <img src={o.data.avatar ? o.data.avatar : logo} alt='' />
                        </span>
                        <div className='content'>
                            {
                                o.type === 101 ?
                                    <p>{o.data.name} is follow you</p>
                                    :
                                    o.type === 102 ?
                                        <p>{o.data.name} is comment on your video</p>
                                        :
                                        o.type === 103 ?
                                            <p>Your video {o.data.video_name} upload success</p>
                                            :
                                            o.type === 104 ?
                                                <p>{o.data.name} upload new video {o.data.video_name}</p>
                                                :
                                                o.type === 105 ?
                                                    <p>{o.data.name} is streaming</p>
                                                    : null

                            }
                            <p>{convertDateAgo(o.last_update)}</p>
                        </div>
                    </div>)}

                </div>
            </div>
        </>
    )
}