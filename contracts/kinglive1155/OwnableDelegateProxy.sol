

// File: contracts/ProxyRegistry.sol

pragma solidity ^0.5.0;

contract OwnableDelegateProxy {}

contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}
