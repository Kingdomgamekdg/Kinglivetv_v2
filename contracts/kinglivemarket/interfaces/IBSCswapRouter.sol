pragma solidity ^0.7.0;

interface IBSCswapRouter {
    function getAmountsOut(
        uint amountIn,
        address[] calldata path)
    external view returns (uint[] memory amounts);
}