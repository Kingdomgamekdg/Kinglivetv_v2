import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import noData from '../../assets/images/nft-market/no-data.png'

const Bidding = () => {
    return (
        <>
            <div className="box-bidding">
                <div className="content-bidding">
                    <h2 className="title-bidding">
                        Bidding
                    </h2>
                    <div className="table-bidding">
                        <table>
                            <tr className="tr-1">
                                <th>
                                    Address
                                </th>
                                <th>
                                    Price
                                </th>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <div className="box-data">
                                        <div className="non-data">
                                            <img src={noData} alt="" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Bidding