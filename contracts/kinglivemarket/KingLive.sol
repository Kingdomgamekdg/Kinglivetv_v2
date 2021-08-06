pragma solidity ^0.7.0;

import './Ownable.sol';
import './Pausable.sol';
import './ERC1155Hodler.sol';
import './libraries/SafeMath.sol';
import './libraries/SafeERC20.sol';
import './interfaces/IReferral.sol';
import './interfaces/IERC1155.sol';
import './interfaces/IERC20.sol';
import './interfaces/IKingLiveExchange.sol';
import './KingLiveExchange.sol';
import './ERC20.sol';

contract KingLive is Ownable, Pausable, ERC1155Hodler {
    using SafeMath for uint256;
    using SafeERC20 for ERC20;

    address public farmingContract;
    address public referralContract;
    address public kingLiveExchangeContract;

    uint256 public constant ZOOM_KING_LIVE = 10 ** 18;
    uint256 public constant ZOOM_USDT = 10 ** 6;
    uint256 public constant ZOOM_FEE = 10 ** 2;

    uint256 public marketFee;
    uint256 public firstSellFee;
    uint256 public artistLoyaltyFee;
    uint256 public referralFee;

    uint256 public numberItems;
    uint256 public numberBidOrders;

    struct Item {
        address owner;
        address tokenAddress;
        address paymentToken;
        uint256 tokenId;
        uint256 quantity;
        uint256 expired;
        uint256 status; // 1: available| 2: sold out| 3: cancel list
        uint256 minBid;
        uint256 price;
        uint256 mask; // 1: for sale | 2: for bid
    }

    struct Fee {
        uint256 itemFee;
        uint256 buyerFee;
        uint256 sellerFee;
        uint256 loyaltyFee;
    }
    struct ReferralAddress {
        address payable buyerRef;
        address payable sellerRef;
    }
    struct BidOrder {
        address fromAddress;
        address bidToken;
        uint256 bidPrice;
        uint256 itemId;
        uint256 quantity;
        uint256 expired;
        uint256 status; // 1: available | 2: done | 3: reject
    }

    mapping(uint256 => Item) public items;
    mapping(address => mapping(uint256 => uint256)) public lastSalePrice;
    mapping(uint256 => BidOrder) public bidOrders;
    mapping(address => uint256) public whitelistPayableToken;

    event Withdraw(address indexed beneficiary, uint256 withdrawAmount);
    event FailedWithdraw(address indexed beneficiary, uint256 withdrawAmount);
    event Buy(uint256 _itemId, address _from, address _to, uint256 _quantity, address _paymentToken, uint256 _paymentAmount);
    event UpdateItem(uint256 _itemId,address _from, uint256 _mask, uint256 _price, address _paymentToken, uint256 _expiration);
    event CancelListed(uint256 _itemId, address _receiver);
    event Bid(uint _bidId, address _from, address _to, uint256 _itemId, uint256 _quantity, address _bidToken, uint256 _bidPrice, uint256 _expiration);
    event List(uint _orderId,address _owner, address _tokenAddress, uint256 tokenId, uint256 _quantity, uint256 _mask, uint256 _price, address _paymentToken, uint256 _expiration);
    event AcceptBid(uint256 _itemId,uint256 _bidOrderId,address _from,address _to , bool _result);
    event CancelBid(uint256 _itemId,uint256 _bidOrderId,address _from,address _to , bool _result);
    event UpdateBid(uint256 _itemId,uint256 _bidId,address _from, uint256 _quantity, address _bidToken, uint256 _bidPrice, uint256 _expiration, uint _status);
    event AdminMigrateData(uint256 _itemId, address _owner, address _toContract);
    
    constructor() public {
        marketFee = 5;
        firstSellFee = 0;
        artistLoyaltyFee = 0;
        referralFee = 0;
        kingLiveExchangeContract = 0xA746f14c60ec8Afd9A23B373A3eFF5ea6Cf1c9E8;
        farmingContract = 0xA746f14c60ec8Afd9A23B373A3eFF5ea6Cf1c9E8;
        referralContract = 0xA746f14c60ec8Afd9A23B373A3eFF5ea6Cf1c9E8;
        _pause();
    }
    

    function pause() onlyOwner public {
        _pause();
    }
    function unPause() onlyOwner public {
        _unpause();
    }

    function setSystemFee(uint256 _marketFee, uint256 _firstSellFee, uint256 _artistLoyaltyFee, uint256 _referralFee) onlyOwner
    public returns (bool) {
        marketFee = _marketFee;
        firstSellFee = _firstSellFee;
        artistLoyaltyFee = _artistLoyaltyFee;
        referralFee = _referralFee;
        return true;
    }

    function setFarmingContract(address _farmingContract) onlyOwner public returns (bool) {
        farmingContract = _farmingContract;
        return true;
    }

    function setReferralContract(address _referralContract) onlyOwner public returns (bool) {
        referralContract = _referralContract;
        return true;
    }

    function setKingLiveExchangeContract(address _kingLiveExchangeContract) onlyOwner public returns (bool) {
        kingLiveExchangeContract = _kingLiveExchangeContract;
        return true;
    }

    function setWhiteListPayableToken(address _token, uint256 _status) onlyOwner public returns (bool){
        whitelistPayableToken[_token] = _status;
        if (_token != address (0)) {
            IERC20(_token).approve(msg.sender, uint(-1));
            IERC20(_token).approve(address (this), uint(-1));
        }
        return true;
    }


    function getReferralAddress(address _user) private returns(address payable) {
        return payable(IReferral(referralContract).getReferral(_user));
    }

    Fee fee;
    ReferralAddress ref;

    function estimateUSDT(address _paymentToken, uint256 _paymentAmount) private returns (uint256) {
        return IKingLiveExchange(kingLiveExchangeContract).estimateToUSDT(_paymentToken, _paymentAmount);
    }

    function estimateToken(address _paymentToken, uint256 _usdtAmount) private returns (uint256) {
        return IKingLiveExchange(kingLiveExchangeContract).estimateFromUSDT(_paymentToken, _usdtAmount);
    }

    function executeOrder(address _buyer, uint256 _itemId, uint256 _quantity, address _paymentToken, uint256 _paymentAmount)
    private returns(bool) {
        Item storage item = items[_itemId];
        address payable creator = payable(IERC1155(item.tokenAddress).getCreator(item.tokenId));
        // uint256 loyalty = IERC1155(item.tokenAddress).getLoyaltyFee(item.tokenId);

        // uint256 itemPrice = estimateToken(_paymentToken, item.price.div(item.quantity).mul(_quantity));
        require (_paymentAmount >= item.price.mul(_quantity), 'Invalid price');
        _paymentAmount = item.price.mul(_quantity);
        uint256 feeAmount = _paymentAmount.mul(artistLoyaltyFee).div(ZOOM_FEE);
        uint256 feeAmountMarket = _paymentAmount.mul(marketFee).div(ZOOM_FEE);
        ERC20(_paymentToken).safeTransferFrom(_buyer, address(this), _paymentAmount);
        if(item.owner == creator){
            IERC20(_paymentToken).transfer(item.owner, _paymentAmount.sub(feeAmountMarket));
        } else {
            IERC20(_paymentToken).transfer(item.owner, _paymentAmount.sub(feeAmount).sub(feeAmountMarket));
            IERC20(_paymentToken).transfer(creator, feeAmount);
        }
        IERC1155(item.tokenAddress).safeTransferFrom(address(this), _buyer, item.tokenId, _quantity,
            abi.encodePacked(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)")));
        // lastSalePrice[item.tokenAddress][item.tokenId] = priceInUsdt.mul(ZOOM_FEE + marketFee).div(ZOOM_FEE);
        // item.price = item.price.sub(priceInUsdt);
        item.quantity = item.quantity.sub(_quantity);
        if (item.quantity == 0) {
            item.status = 2; // sold out
        }
        return true;
    }

    function list(address _tokenAddress, uint256 _tokenId, uint256 _quantity, uint256 _mask, uint256 _price, address _paymentToken, uint256 _expiration)
    public returns (uint256 _idx){
        uint balance = IERC1155(_tokenAddress).balanceOf(msg.sender, _tokenId);
        require(balance >= _quantity, 'Not enough token for sale');
        require(whitelistPayableToken[_paymentToken] == 1, 'Payment token not support');

        IERC1155(_tokenAddress).safeTransferFrom(msg.sender, address(this), _tokenId, _quantity, abi.encodePacked(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)")));

        _idx = numberItems;
        Item storage item = items[_idx];
        item.tokenId = _tokenId;
        item.owner = msg.sender;
        item.tokenAddress = _tokenAddress;
        item.quantity = _quantity;
        item.expired = block.timestamp.add(_expiration);
        item.status = 1;
        if (_mask == 1) {
            item.price = _price;
        } else {
            item.minBid = _price;
        }
        item.mask = _mask;
        item.paymentToken = _paymentToken;
        emit List(_idx,msg.sender, _tokenAddress, _tokenId, _quantity, _mask, _price, _paymentToken, _expiration);
        ++numberItems;
        return _idx;
    }

    function bid(uint256 _itemId, uint256 _quantity, address _bidToken, uint256 _bidPrice, uint256 _expiration)
    external payable returns (uint256 _idx){
        _idx = numberBidOrders;
        Item memory item = items[_itemId];
        require(item.owner != address(0), 'Item not exist');
        require(item.status == 1, 'Item unavailable');
        require(item.quantity >= _quantity, 'Quantity invalid');
        require(item.owner != msg.sender, 'Owner cannot bid');
        require(item.mask == 2, 'Not for bid');
        require(item.expired >= block.timestamp, 'Item expired');
        require(whitelistPayableToken[_bidToken] == 1, 'Payment token not support');
        require(IERC20(_bidToken).approve(address(this), _bidPrice) == true, 'Approve token for bid fail');
        require (_bidPrice >= item.minBid, 'Invalid price');
        uint256 _paymentAmount = _bidPrice.mul(_quantity);
        ERC20(_bidToken).safeTransferFrom(msg.sender, address(this), _paymentAmount);
        BidOrder storage bidOrder = bidOrders[_idx];
        bidOrder.fromAddress = msg.sender;
        bidOrder.bidToken = _bidToken;
        bidOrder.bidPrice = _bidPrice;
        bidOrder.quantity = _quantity;
        bidOrder.expired = block.timestamp.add(_expiration);
        bidOrder.status = 1;

        numberBidOrders++;
        emit Bid(_idx,msg.sender,item.owner , _itemId, _quantity, _bidToken, _bidPrice, _expiration);
        return _idx;
    }

    function buy(uint256 _itemId, uint256 _quantity, address _paymentToken, uint256 _paymentAmount)
    external payable returns (bool) {
        Item storage item = items[_itemId];
        require(item.owner != address(0), 'Item not exist');
        require(whitelistPayableToken[_paymentToken] == 1, 'Payment token not support');
        require(item.owner != msg.sender, 'Owner cannot bid');
        require(item.status == 1, 'Item unavailable');
        require(item.quantity >= _quantity, 'Invalid quantity');
        require(item.expired >= block.timestamp, 'Item expired');
        require(item.mask == 1, 'Not for sale');
        require(IERC20(_paymentToken).approve(address(this), _paymentAmount) == true, 'Approve token for buy fail');
        emit Buy(_itemId, msg.sender, item.owner, _quantity, _paymentToken, _paymentAmount);
        if (executeOrder(msg.sender, _itemId, _quantity, _paymentToken, _paymentAmount)) {
            return true;
        }
        return false;
    }

    function acceptBid(uint256 _bidOrderId) public returns (bool) {
        BidOrder storage bidOrder = bidOrders[_bidOrderId];
        require(bidOrder.status == 1, 'Bid order unavailable');
        require(bidOrder.expired >= block.timestamp, 'Bid order has expired');
        address _fromAddress = msg.sender;
        address _toAddress = bidOrder.fromAddress;
        Item storage item = items[bidOrder.itemId];
        require(item.owner == msg.sender, 'onlly Owner can accept');

        address payable creator = payable(IERC1155(item.tokenAddress).getCreator(item.tokenId));
        uint256 _paymentAmount= bidOrder.quantity.mul(bidOrder.bidPrice);
        uint256 feeAmount = _paymentAmount.mul(artistLoyaltyFee).div(ZOOM_FEE);
        uint256 feeAmountMarket = _paymentAmount.mul(marketFee).div(ZOOM_FEE);        
        if(item.owner == creator){
            IERC20(bidOrder.bidToken).transfer(item.owner, _paymentAmount.sub(feeAmountMarket));
        } else {
            IERC20(bidOrder.bidToken).transfer(item.owner, _paymentAmount.sub(feeAmount).sub(feeAmountMarket));
            IERC20(bidOrder.bidToken).transfer(creator, feeAmount);
        }
        IERC1155(item.tokenAddress).safeTransferFrom(address(this), bidOrder.fromAddress, item.tokenId , bidOrder.quantity,
            abi.encodePacked(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)")));
        item.quantity = item.quantity.sub(bidOrder.quantity);
        if (item.quantity == 0) {
            item.status = 2; // sold out
        }
        bidOrder.status = 2;
        emit AcceptBid(bidOrder.itemId,_bidOrderId,_fromAddress,_toAddress , true);
        return true;
    }
    
   function cancelBid(uint256 _bidOrderId) public returns (bool) {
        BidOrder storage bidOrder = bidOrders[_bidOrderId];
        require(bidOrder.status == 1, 'Bid order unavailable');
        require(bidOrder.expired >= block.timestamp, 'Bid order has expired');
        address _fromAddress = msg.sender;
        address _toAddress = bidOrder.fromAddress;
        require(bidOrder.fromAddress == msg.sender, 'onlly buyer can cancel');
        IERC20(bidOrder.bidToken).transfer(bidOrder.fromAddress, bidOrder.quantity.mul(bidOrder.bidPrice));
        bidOrder.status = 3;
        emit CancelBid(bidOrder.itemId,_bidOrderId, _fromAddress,_toAddress, false);
        return true;
    }

    function updateItem(uint256 _itemId, uint256 _mask, uint256 _price, address _paymentToken, uint256 _expiration)
    public returns (bool) {
        Item storage item = items[_itemId];
        require(item.owner == msg.sender, 'Not the owner of this item');
        require(item.expired < block.timestamp, 'Already on sale');
        require(whitelistPayableToken[_paymentToken] == 1, 'Payment token not support');
        item.mask = _mask;
        if (_mask == 1) {
            item.price = _price;
        } else {
            item.minBid = _price;
        }
        item.paymentToken = _paymentToken;
        item.expired = block.timestamp.add(_expiration);
        emit UpdateItem(_itemId, msg.sender, _mask, _price, _paymentToken, _expiration);
        return true;
    }

    function updateBid(uint256 _bidId, uint256 _quantity, address _bidToken, uint256 _bidPrice, uint256 _expiration, uint _status)
    public returns (bool) {
        BidOrder storage bidOrder = bidOrders[_bidId];
        require(bidOrder.fromAddress == msg.sender, 'Not owner');
        require(IERC20(_bidToken).approve(address(this), _quantity.mul(_bidPrice)) == true, 'Approve token for bid fail');
        bidOrder.bidToken = _bidToken;
        bidOrder.bidPrice = _bidPrice ;
        bidOrder.quantity = _quantity;
        bidOrder.expired = block.timestamp.add(_expiration);
        bidOrder.status = _status;
        emit UpdateBid(bidOrder.itemId,_bidId, msg.sender, _quantity, _bidToken, _bidPrice, _expiration, _status);
        return true;
    }

    function cancelListed(uint256 _itemId) public returns (bool) {
        Item storage item = items[_itemId];
        require(item.owner == msg.sender, 'Not the owner of this item');
        // require(item.expired >= block.timestamp, 'item has expired');

        IERC1155(item.tokenAddress).safeTransferFrom(address(this), msg.sender,  item.tokenId, item.quantity,
            abi.encodePacked(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)")));

        item.status = 3;
        item.quantity = 0;
        item.price = 0;
        emit CancelListed(_itemId, item.owner);
        return true;
    }

    /// withdraw allows the owner to transfer out the balance of the contract.
    function withdrawFunds(address payable _beneficiary, address _tokenAddress) external onlyOwner {
        uint _withdrawAmount;
        if (_tokenAddress == address(0)) {
            _beneficiary.transfer(address(this).balance);
            _withdrawAmount = address(this).balance;
        } else {
            _withdrawAmount = IERC20(_tokenAddress).balanceOf(address(this));
            IERC20(_tokenAddress).transfer( _beneficiary, _withdrawAmount);
        }
        emit Withdraw(_beneficiary, _withdrawAmount);
    }

    function adminCancelList(uint256 _itemId, address _receiver) external onlyOwner {
        Item storage item = items[_itemId];
        require(item.expired < block.timestamp, 'Already on sale');

        IERC1155(item.tokenAddress).safeTransferFrom(address(this), _receiver,  item.tokenId, item.quantity,
            abi.encodePacked(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)")));

        item.status = 3;
        item.quantity = 0;
        item.price = 0;
        emit CancelListed(_itemId, _receiver);
    }

    function adminMigrateData(uint256 _itemId, address _owner, address _tokenAddress, address _paymentToken,
        uint256 _tokenId, uint256 _quantity, uint256 _expired, uint256 _status, uint256 _minBid,
        uint256 _price, uint256 _mask, uint256 _lastSalePrice) external onlyOwner whenPaused {

        if (_quantity > 0) {
            IERC1155(_tokenAddress).safeTransferFrom(msg.sender, address(this), _tokenId, _quantity, abi.encodePacked(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)")));
        }
        Item storage item = items[_itemId];
        item.tokenId = _tokenId;
        item.owner = _owner;
        item.tokenAddress = _tokenAddress;
        item.quantity = _quantity;
        item.expired = _expired;
        item.status = _status;
        item.price = _price;
        item.minBid = _minBid;
        item.mask = _mask;
        item.paymentToken = _paymentToken;
        numberItems = _itemId;
        if (_lastSalePrice > 0) {
            lastSalePrice[_tokenAddress][_tokenId] = _lastSalePrice;
        }
        AdminMigrateData(_itemId, _owner, address(this));
    }
}