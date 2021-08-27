pragma solidity ^0.7.0;

import './Ownable.sol';
contract KingLiveReferral is Ownable {
    address public kingLiveMarket = 0x2706A69c1EE58618A18c746dbc68e42cF882B58D;

    mapping(address => address) private referralData;

    function setReferral(address _user, address _ref) public onlyOwner{
        referralData[_user] = _ref;
    }

    function setSotaMarket(address _marketAddress) public onlyOwner {
        kingLiveMarket = _marketAddress;
    }

    function getReferral(address _user) public view returns(address){
        if (referralData[_user] == address (0)) {
            return kingLiveMarket;
        }
        return referralData[_user];
    }
}