import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import avatar from '../../assets/images/nft-market/avatar.png'

const TradingHistory = () => {
    return (
        <>
            <div className="box-trading">
                <div className="content-trading">
                    <h2 className="title-trading">
                        Trading History
                    </h2>
                    <div className="table-history">
                        <table>
                            <tr className="tr-1">
                                <th>
                                    From / To
                                </th>
                                <th>
                                    Amount
                                </th>
                                <th>
                                    Price (KDG)
                                </th>
                                <th>
                                    Action
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    <div className="info-user">
                                        <div className="avt">
                                            <img src={avatar} alt="" />
                                        </div>
                                        <div className="info">
                                            <span className="info-name">
                                                Esther Howard
                                            </span>
                                            <span className="info-date">
                                                05/10/2021
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    1
                                </td>
                                <td>
                                    100,000
                                </td>
                                <td>
                                    Donate
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="info-user">
                                        <div className="avt">
                                            <img src={avatar} alt="" />
                                        </div>
                                        <div className="info">
                                            <span className="info-name">
                                                Esther Howard
                                            </span>
                                            <span className="info-date">
                                                05/10/2021
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    1
                                </td>
                                <td>
                                    100,000
                                </td>
                                <td>
                                    Donate
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
export default TradingHistory