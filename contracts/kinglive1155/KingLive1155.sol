pragma solidity ^0.5.0;

import './ERC1155Tradable.sol';

contract KingLive1155 is ERC1155Tradable {
    constructor() public ERC1155Tradable("KingLive1155", "KL1155") {
        _setBaseMetadataURI("https://api.sotadx.com/");
    }
}