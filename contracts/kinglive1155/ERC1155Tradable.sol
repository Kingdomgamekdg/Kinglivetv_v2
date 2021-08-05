// File: contracts/ERC1155Tradable.sol

pragma solidity ^0.5.0;

import './ERC1155.sol';
import './ERC20.sol';
import './interfaces/IERC20.sol';
import './ERC1155MintBurn.sol';
import './ERC1155Metadata.sol';
import './Ownable.sol';
import './MinterRole.sol';
import './WhitelistAdminRole.sol';
import './libraries/Strings.sol';
import './ProxyRegistry.sol';
contract ERC1155Tradable is
    ERC1155,
    ERC1155MintBurn,
    ERC1155Metadata,
    Ownable,
    MinterRole,
    WhitelistAdminRole
{
    using Strings for string;
     
    address proxyRegistryAddress;
    uint256 private _currentTokenID = 0;
    mapping(address => bool) public whiteListCreators;
    mapping(address => bool) public reviewers;
    mapping(uint256 => address) public creators;
    mapping(uint256 => uint256) public royaltyFee;
    mapping(uint256 => uint256) public tokenSupply;
    mapping(uint256 => uint256) public tokenMaxSupply;
    mapping(uint256 => string) public tokenURI;
    mapping(uint256 => bool) public isReviewed;

    // Contract name
    string public name;
    // Contract symbol
    string public symbol;
    
    uint256 public mintingFee;
    uint256 public ZOO_FEE;
    address  public  feeToken;
    event Create(address indexed _creator, uint256 indexed _id, string _uri ,uint indexed _royaltyFee,bool _isReviewed, uint256 _maxSupply, uint256 _initSupply);
    event Review(address indexed _reviewer, uint256 indexed _id,bool _result);

    modifier onlyWhiteListCreator() {
        require(whiteListCreators[msg.sender], "Only-white-list-can-create");
        _;
    }
    modifier onlyReviewer() {
        require(reviewers[msg.sender], "Only-reviewer-can-review");
        _;
    }

    constructor(string memory _name, string memory _symbol) public {
        name = _name;
        symbol = _symbol;
        whiteListCreators[msg.sender] = true;
        reviewers[msg.sender] = true;
        mintingFee = 5;
        ZOO_FEE = 10**18;
        feeToken = 0xB73b2e0C455F125Bbec80f41a864A33fC67aaDa0;
    }
    
    function reviewAsset(uint256 tokenId,bool accept) external onlyReviewer {
        isReviewed[tokenId] = accept;
        emit Review(msg.sender, tokenId, accept);
    }
    
    function getMintingFee() public view returns (uint256) {
        return mintingFee;
    }
    
    function setMintingFee(uint256 _mintingFee) public onlyOwner {
        mintingFee = _mintingFee;
    }
    
     function getFeeToken() public view  returns (address) {
        return feeToken;
    }
    
    function setFeeToken(address _feeToken) public onlyOwner {
        feeToken = _feeToken;
    }

    function removeWhitelistAdmin(address account) public onlyOwner {
        _removeWhitelistAdmin(account);
    }

    function adminWhiteListCreators(address creator, bool whiteList)
        public
        onlyOwner
    {
        whiteListCreators[creator] = whiteList;
    }
    
    function addReviewer(address reviewer, bool canReview)
        public
        onlyOwner
    {
        reviewers[reviewer] = canReview;
    }

    function uri(uint256 _id) public view returns (string memory) {
        require(_exists(_id), "ERC1155Tradable#uri: NONEXISTENT_TOKEN");
        return Strings.strConcat(baseMetadataURI, tokenURI[_id]);
    }

    /**
     * @dev Returns the total quantity for a token ID
     * @param _id uint256 ID of the token to query
     * @return amount of token in existence
     */
    function totalSupply(uint256 _id) public view returns (uint256) {
        return tokenSupply[_id];
    }

    /**
     * @dev Returns the max quantity for a token ID
     * @param _id uint256 ID of the token to query
     * @return amount of token in existence
     */
    function maxSupply(uint256 _id) public view returns (uint256) {
        return tokenMaxSupply[_id];
    }

    /**
     * @dev Will update the base URL of token's URI
     * @param _newBaseMetadataURI New base URL of token's URI
     */
    function setBaseMetadataURI(string memory _newBaseMetadataURI)
        public
        onlyWhitelistAdmin
    {
        _setBaseMetadataURI(_newBaseMetadataURI);
    }

    /**
     * @dev Creates a new token type and assigns _initialSupply to an address
     * @param _maxSupply max supply allowed
     * @param _initialSupply Optional amount to supply the first owner
     * @param _uri Optional URI for this token type
     * @param _data Optional data to pass if receiver is contract
     * @return The newly created token ID
     */
    function create(
        uint256 _maxSupply,
        uint256 _initialSupply,
        uint256 _royaltyFee,
        string calldata _uri,
        bytes calldata _data
    )  external payable  returns (uint256 tokenId) {
        require(
            _initialSupply <= _maxSupply,
            "Initial supply cannot be more than max supply"
        );
        require(0 <= _royaltyFee && _royaltyFee <= 10000, "Invalid-loyalty-fee");
        require(IERC20(feeToken).balanceOf(msg.sender) > mintingFee.mul(ZOO_FEE) ,"not enough balance");
        require(IERC20(feeToken).approve(address(this), mintingFee.mul(ZOO_FEE)) == true, 'Approve token for buy fail');

        uint256 _id = _getNextTokenID();
        _incrementTokenTypeId();
        creators[_id] = msg.sender;
        royaltyFee[_id] = _royaltyFee;
        tokenURI[_id] = _uri;
        ERC20(feeToken).transferFrom(msg.sender, address(this),mintingFee.mul(ZOO_FEE));
        if (_initialSupply != 0) _mint(msg.sender, _id, _initialSupply, _data);
        tokenSupply[_id] = _initialSupply;
        tokenMaxSupply[_id] = _maxSupply;
        isReviewed[_id] = getReview(msg.sender);
        tokenMaxSupply[_id] = _maxSupply;
        emit Create(msg.sender, _id, _uri, _royaltyFee, getReview(msg.sender), _maxSupply, _initialSupply);
        return _id;
    }
    
    function getReview(address sender)
         internal view returns (bool)
    {
        if(sender == this.owner()){
            return true;
        } else {
            return false;
        }
    }


    /**
     * @dev Mints some amount of tokens to an address
     * @param _to          Address of the future owner of the token
     * @param _id          Token ID to mint
     * @param _quantity    Amount of tokens to mint
     * @param _data        Data to pass if receiver is contract
     */
    function mint(
        address _to,
        uint256 _id,
        uint256 _quantity,
        bytes memory _data
    ) public onlyMinter {
        uint256 tokenId = _id;
        require(
            tokenSupply[tokenId] < tokenMaxSupply[tokenId],
            "Max supply reached"
        );
        _mint(_to, _id, _quantity, _data);
        tokenSupply[_id] = tokenSupply[_id].add(_quantity);
    }

    /**
     * Set proxyRegistryAddress
     */
    function setProxyAddress(address _proxyRegistryAddress)
        public
        onlyOwner
        returns (bool)
    {
        proxyRegistryAddress = _proxyRegistryAddress;
        return true;
    }

    /**
     * Override isApprovedForAll to whitelist user's proxy accounts to enable gas-free listings later
     */
    function isApprovedForAll(address _owner, address _operator)
        public
        view
        returns (bool isOperator)
    {
        if (proxyRegistryAddress != address(0)) {
            ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
            if (address(proxyRegistry.proxies(_owner)) == _operator) {
                return true;
            }
        }

        return ERC1155.isApprovedForAll(_owner, _operator);
    }

    /**
     * @dev Returns whether the specified token exists by checking to see if it has a creator
     * @param _id uint256 ID of the token to query the existence of
     * @return bool whether the token exists
     */
    function _exists(uint256 _id) internal view returns (bool) {
        return creators[_id] != address(0);
    }

    /**
     * @dev calculates the next token ID based on value of _currentTokenID
     * @return uint256 for the next token ID
     */
    function _getNextTokenID() private view returns (uint256) {
        return _currentTokenID.add(1);
    }

    /**
     * @dev increments the value of _currentTokenID
     */
    function _incrementTokenTypeId() private {
        _currentTokenID++;
    }

    function getCreator(uint256 _id) public view returns (address) {
        return creators[_id];
    }

    function getroyaltyFee(uint256 _id) public view returns (uint256) {
        return royaltyFee[_id];
    }
}